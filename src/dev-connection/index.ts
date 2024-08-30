/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */

/**
 * This Custom Element does not have a UI, so it's specifically excluded from the linting rules and declared a class.
 */
import type { UndefinedOr } from '@devprotocol/util-ts'
import {
	type Signer,
	type ContractRunner,
	type Eip1193Provider,
	type BrowserProvider,
	type EventEmitterable,
	type Networkish,
} from 'ethers'
import { BehaviorSubject, Subscription } from 'rxjs'
import { UllrElement } from '@aggre/ullr'

const newSigner = () => new BehaviorSubject<UndefinedOr<Signer>>(undefined)
const newProvider = () =>
	new BehaviorSubject<UndefinedOr<ContractRunner>>(undefined)
const newAccount = () => new BehaviorSubject<UndefinedOr<string>>(undefined)
const newChain = () => new BehaviorSubject<UndefinedOr<number>>(undefined)
const newEip1193Provider = () =>
	new BehaviorSubject<UndefinedOr<Eip1193Provider>>(undefined)
const newIdentifiers = () =>
	new BehaviorSubject<UndefinedOr<{ email?: string }>>(undefined)
const newSignal = () => new BehaviorSubject<UndefinedOr<string>>(undefined)

const testEventEmitterable = (
	x: any,
): x is EventEmitterable<'chainChanged' | 'accountsChanged' | 'disconnect'> => {
	const test = 'on' in x
	const test2 = 'removeListener' in x
	return test && test2
}

export class Connection extends UllrElement {
	static get is(): string {
		return 'dev-connection'
	}

	private _signer!: BehaviorSubject<UndefinedOr<Signer>>
	private _provider!: BehaviorSubject<UndefinedOr<ContractRunner>>
	private _account!: BehaviorSubject<UndefinedOr<string>>
	private _chain!: BehaviorSubject<UndefinedOr<number>>
	private _eip1193Provider!: BehaviorSubject<UndefinedOr<Eip1193Provider>>
	private _identifiers!: BehaviorSubject<UndefinedOr<{ email?: string }>>
	private _signerSubscription!: Subscription
	private _providerSubscription!: Subscription
	private _signal!: BehaviorSubject<UndefinedOr<string>>
	private _chainChangedListener = (chainId: number | string) => {
		if (this._chain) {
			this._chain.next(Number(chainId))
		}
	}
	private _accountsChangedListener = (accounts: string[]) => {
		if (this._account) {
			this._account.next(accounts[0])
		}
	}
	private _disconnectListener = () => {
		if (this._signer) {
			this._signer.next(undefined)
		}
	}

	get signer() {
		return this._signer
	}

	get provider() {
		return this._provider
	}

	get account() {
		return this._account
	}

	get chain() {
		return this._chain
	}

	get eip1193Provider() {
		return this._eip1193Provider
	}

	get identifiers() {
		return this._identifiers
	}

	get signal() {
		return this._signal
	}

	async setEip1193Provider(
		prov: Eip1193Provider,
		providerFactory?: typeof BrowserProvider,
		network?: Networkish,
	) {
		const old = this.eip1193Provider.value
		this.eip1193Provider.next(prov)
		if (prov && testEventEmitterable(prov)) {
			prov.on('chainChanged', this._chainChangedListener)
			prov.on('accountsChanged', this._accountsChangedListener)
			prov.on('disconnect', this._disconnectListener)
		}
		if (old && testEventEmitterable(old)) {
			old.removeListener('chainChanged', this._chainChangedListener)
			old.removeListener('accountsChanged', this._accountsChangedListener)
			old.removeListener('disconnect', this._disconnectListener)
		}
		if (providerFactory) {
			const browserProvider = new providerFactory(prov, network)
			this.signer.next(await browserProvider.getSigner())
		}
	}

	connectedCallback() {
		this._signer = newSigner()
		this._provider = newProvider()
		this._account = newAccount()
		this._chain = newChain()
		this._eip1193Provider = newEip1193Provider()
		this._identifiers = newIdentifiers()
		this._signal = newSignal()

		this._signerSubscription = this.signer.asObservable().subscribe((x) => {
			if (x === undefined) {
				this.account.next(undefined)
				this.provider.next(undefined)
				return
			}
			const { provider } = x
			if (provider) {
				this.provider.next(provider)
			} else {
				this.provider.next(undefined)
			}
			x.getAddress().then((addr) => this.account.next(addr))
		})

		this._providerSubscription = this.provider.asObservable().subscribe((x) => {
			if (x === undefined) {
				this.chain.next(undefined)
				return
			}
			x.provider
				?.getNetwork()
				.then((net) => this.chain.next(Number(net.chainId)))
		})
	}

	disconnectedCallback(): void {
		this._signerSubscription.unsubscribe()
		this._providerSubscription.unsubscribe()
		this.signer.complete()
		this.provider.complete()
		this.account.complete()
		this.chain.complete()
		this.identifiers.complete()
		this.signal.complete()
	}
}
