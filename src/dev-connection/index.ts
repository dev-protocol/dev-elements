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
import { UndefinedOr } from '@devprotocol/util-ts'
import { ethers, providers } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'
import { BehaviorSubject, Subscription } from 'rxjs'
import { UllrElement } from '@aggre/ullr'

const newSigner = () =>
	new BehaviorSubject<UndefinedOr<ethers.Signer>>(undefined)
const newProvider = () =>
	new BehaviorSubject<UndefinedOr<BaseProvider>>(undefined)
const newAccount = () => new BehaviorSubject<UndefinedOr<string>>(undefined)
const newChain = () => new BehaviorSubject<UndefinedOr<number>>(undefined)

const providerTest = (
	x: ethers.providers.Provider
): x is providers.Web3Provider =>
	Object.prototype.hasOwnProperty.call(x, 'polling')

export class Connection extends UllrElement {
	static get is(): string {
		return 'dev-connection'
	}

	private _signer!: BehaviorSubject<UndefinedOr<ethers.Signer>>
	private _provider!: BehaviorSubject<UndefinedOr<BaseProvider>>
	private _account!: BehaviorSubject<UndefinedOr<string>>
	private _chain!: BehaviorSubject<UndefinedOr<number>>
	private _signerSubscription!: Subscription
	private _providerSubscription!: Subscription

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

	connectedCallback() {
		this._signer = newSigner()
		this._provider = newProvider()
		this._account = newAccount()
		this._chain = newChain()

		this._signerSubscription = this.signer.asObservable().subscribe((x) => {
			if (x === undefined) {
				this.account.next(undefined)
				this.provider.next(undefined)
				return
			}
			const { provider } = x
			if (provider && providerTest(provider)) {
				this.provider.next(provider)
			} else {
				this.provider.next(undefined)
			}
			x.getAddress().then(this.account.next)
		})

		this._providerSubscription = this.provider.asObservable().subscribe((x) => {
			if (x === undefined) {
				this.chain.next(undefined)
				return
			}
			x.getNetwork().then((net: Readonly<{ chainId: number }>) =>
				this.chain.next(net.chainId)
			)
		})
	}

	disconnectedCallback(): void {
		this._signerSubscription.unsubscribe()
		this._providerSubscription.unsubscribe()
		this.signer.complete()
		this.provider.complete()
		this.account.complete()
		this.chain.complete()
	}
}
