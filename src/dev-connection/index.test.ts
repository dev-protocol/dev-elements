import { expect } from '@esm-bundle/chai'
import { ethers } from 'ethers'
import { Connection } from './index'
import { define } from '@aggre/ullr'
import { html, render } from 'lit'
import { rpcEndpoints, waitForUpdated } from '../lib/test'
import { filter } from 'rxjs'

define(Connection)

const ID = 'connection'
const connection = (): Connection => document.getElementById(ID) as Connection

describe('dev-connection', () => {
	beforeEach(() => {
		render(html``, document.body)
		render(html`<dev-connection id=${ID}></dev-connection>`, document.body)
	})
	describe('Exposes signer', () => {
		it('signer is undefined by default', () => {
			const el = connection()
			expect(el.signer.getValue()).to.be.equal(undefined)
		})
		it('signer is BehaviorSubject', () => {
			const el = connection()
			let _count = 0
			el.signer.subscribe(() => {
				_count = _count + 1
			})
			expect(el.signer.getValue()).to.be.equal(undefined)

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			)
			el.signer.next(mock)

			expect(el.signer.getValue()).to.be.equal(mock)
			expect(_count).to.be.equal(2)
		})
		it('when signer is changed, account will update', async () => {
			const el = connection()
			expect(el.account.getValue()).to.be.equal(undefined)

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			)
			el.signer.next(mock)

			await waitForUpdated(el.account.asObservable())
			expect(el.account.getValue()).to.be.equal(await mock.getAddress())
		})
		it('when signer is changed to undefined, account will update to undefined', async () => {
			const el = connection()

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			)
			el.signer.next(mock)
			await waitForUpdated(el.account.asObservable())

			el.signer.next(undefined)

			await waitForUpdated(el.account.asObservable())
			expect(el.account.getValue()).to.be.equal(undefined)
		})
		it('when signer is changed to undefined, provider will update to undefined', async () => {
			const el = connection()

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			)
			el.signer.next(mock)
			expect(el.provider.getValue()).to.be.equal(mock.provider)

			el.signer.next(undefined)

			expect(el.provider.getValue()).to.be.equal(undefined)
		})
		it('when signer is changed and the provider meets BaseProvider, provider will update', async () => {
			const el = connection()
			expect(el.provider.getValue()).to.be.equal(undefined)

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			)
			el.signer.next(mock)

			expect(el.provider.getValue()).to.be.equal(mock.provider)
		})
		it('when signer is changed and the provider is not meets BaseProvider, provider will update to undefined', async () => {
			const el = connection()
			expect(el.provider.getValue()).to.be.equal(undefined)

			const mock = ethers.Wallet.createRandom().connect(
				ethers.getDefaultProvider()
			)
			el.signer.next(mock)

			expect(el.provider.getValue()).to.be.equal(undefined)
		})
	})
	describe('Exposes provider', () => {
		it('provider is undefined by default', () => {
			const el = connection()
			expect(el.provider.getValue()).to.be.equal(undefined)
		})
		it('provider is BehaviorSubject', () => {
			const el = connection()
			let _count = 0
			el.provider.subscribe(() => {
				_count = _count + 1
			})
			expect(el.provider.getValue()).to.be.equal(undefined)

			const mock = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			el.provider.next(mock)

			expect(el.provider.getValue()).to.be.equal(mock)
			expect(_count).to.be.equal(2)
		})
		it('when provider is changed, chain will update', async () => {
			const el = connection()
			expect(el.chain.getValue()).to.be.equal(undefined)

			const mock = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			el.provider.next(mock)

			await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
			expect(el.chain.getValue()).to.be.equal(42161)
		})
		it('when provider is changed to undefined, chain and signer will update to undefined', async () => {
			const el = connection()
			const mock = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			el.provider.next(mock)

			await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
			expect(el.chain.getValue()).to.be.equal(42161)

			el.provider.next(undefined)
			await waitForUpdated(el.chain.pipe(filter((x) => x === undefined)))

			expect(el.chain.getValue()).to.be.equal(undefined)
			expect(el.signer.getValue()).to.be.equal(undefined)
		})
	})
})
