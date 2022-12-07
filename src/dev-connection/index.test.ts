/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable functional/immutable-data */
import { expect } from '@esm-bundle/chai'
import { ethers } from 'bundled-ethers'
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

			await waitForUpdated(el.account)
			expect(el.account.getValue()).to.be.equal(await mock.getAddress())
		})
		it('when signer is changed to undefined, account will update to undefined', async () => {
			const el = connection()

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			)
			el.signer.next(mock)
			await waitForUpdated(el.account)

			el.signer.next(undefined)

			await waitForUpdated(el.account)
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
			const d = new ethers.providers.JsonRpcProvider(rpcEndpoints[1])
			el.provider.next(d)
			expect(el.provider.getValue()).to.be.equal(d)

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
		it('when provider is changed to undefined, chain will update to undefined', async () => {
			const el = connection()
			const mock = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			el.provider.next(mock)

			await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
			expect(el.chain.getValue()).to.be.equal(42161)

			el.provider.next(undefined)
			await waitForUpdated(el.chain.pipe(filter((x) => x === undefined)))

			expect(el.chain.getValue()).to.be.equal(undefined)
		})
		describe('EIP-1193 events listener', () => {
			it('when provider is changed, listen chainChanged event and update chain stream', async () => {
				const el = connection()
				const mock = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				// @ts-ignore
				mock.provider = mock
				el.provider.next(mock)

				mock.emit('chainChanged', 123)

				await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
				expect(el.chain.getValue()).to.be.equal(123)
			})
			it('when provider is changed, remove chainChanged listener for previous provider', async () => {
				const el = connection()
				const mock1 = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				const mock2 = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				// @ts-ignore
				mock1.provider = mock1
				// @ts-ignore
				mock2.provider = mock2

				el.provider.next(mock1)
				el.provider.next(mock2)
				mock2.emit('chainChanged', 456)
				mock1.emit('chainChanged', 123)

				await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
				expect(el.chain.getValue()).to.be.equal(456)
			})
			it('when provider is changed, listen accountsChanged event and update account stream', async () => {
				const el = connection()
				const mock = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				// @ts-ignore
				mock.provider = mock
				el.provider.next(mock)

				mock.emit('accountsChanged', ['1', '2', '3'])

				await waitForUpdated(el.account.pipe(filter((x) => x !== undefined)))
				expect(el.account.getValue()).to.be.equal('1')
			})
			it('when provider is changed, remove accountsChanged listener for previous provider', async () => {
				const el = connection()
				const mock1 = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				const mock2 = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				// @ts-ignore
				mock1.provider = mock1
				// @ts-ignore
				mock2.provider = mock2

				el.provider.next(mock1)
				el.provider.next(mock2)
				mock2.emit('accountsChanged', ['4', '5', '6'])
				mock1.emit('accountsChanged', ['1', '2', '3'])

				await waitForUpdated(el.account.pipe(filter((x) => x !== undefined)))
				expect(el.account.getValue()).to.be.equal('4')
			})
			it('when provider is changed, listen disconnect event and update signer stream', async () => {
				const el = connection()
				const mock = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				// @ts-ignore
				mock.provider = mock
				const mockSigner = ethers.Wallet.createRandom().connect(mock)

				el.signer.next(mockSigner)

				await waitForUpdated(el.signer.pipe(filter((x) => x !== undefined)))
				expect(el.signer.getValue()).to.be.equal(mockSigner)

				mock.emit('disconnect', [1, 'some reason'])

				await waitForUpdated(el.signer.pipe(filter((x) => x === undefined)))
				expect(el.signer.getValue()).to.be.equal(undefined)
			})
			it('when provider is changed, remove disconnect listener for previous provider', async () => {
				const el = connection()
				const mock1 = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				const mock2 = new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
				// @ts-ignore
				mock1.provider = mock1
				// @ts-ignore
				mock2.provider = mock2
				const mockSigner = ethers.Wallet.createRandom().connect(mock2)
				el.signer.next(mockSigner)
				el.provider.next(mock2)
				mock1.emit('disconnect', [1, 'some reason'])

				expect(el.signer.getValue()).to.be.equal(mockSigner)

				mock2.emit('disconnect', [1, 'some reason'])

				await waitForUpdated(el.signer.pipe(filter((x) => x === undefined)))
				expect(el.signer.getValue()).to.be.equal(undefined)
			})
		})
	})
})
