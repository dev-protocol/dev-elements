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
import { ethers } from 'ethers'
import { BehaviorSubject, Subscription } from 'rxjs'
import { UllrElement } from '@aggre/ullr'

const newSigner = () =>
	new BehaviorSubject<UndefinedOr<ethers.Signer>>(undefined)
const newProvider = () =>
	new BehaviorSubject<UndefinedOr<ethers.providers.Provider>>(undefined)
const newAccount = () => new BehaviorSubject<UndefinedOr<string>>(undefined)
const newChain = () => new BehaviorSubject<UndefinedOr<number>>(undefined)

export class DevConnectionElement extends UllrElement {
	static get is(): string {
		return 'dev-connection'
	}

	private _signer!: BehaviorSubject<UndefinedOr<ethers.Signer>>
	private _provider!: BehaviorSubject<UndefinedOr<ethers.providers.Provider>>
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

		this._signerSubscription = this.signer.subscribe(async (x) => {
			if (x === undefined) {
				this.chain.next(undefined)
				return
			}
			const address = await x.getAddress()
			this.account.next(address)
			this.provider.next(x.provider)
		})

		this._providerSubscription = this.provider.subscribe(async (x) => {
			if (x === undefined) {
				this.chain.next(undefined)
				return
			}
			const net = await x.getNetwork()
			this.chain.next(net.chainId)
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
