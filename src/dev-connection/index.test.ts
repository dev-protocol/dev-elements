/* eslint-disable functional/no-conditional-statement */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable functional/immutable-data */
import { expect } from '@esm-bundle/chai'
import { ethers } from 'bundled-ethers'
import { Connection } from './index'
import { define } from '@aggre/ullr'
import { html, render } from 'lit'
import { rpcEndpoints, waitForUpdated } from '../lib/test'
import { filter } from 'rxjs'
import { type Provider } from 'ethers'

define(Connection)

const ID = 'connection'
const connection = (): Connection => document.getElementById(ID) as Connection
const mockProvider = (p: null | Provider) => ({
	provider: p,
	getAddress: () => Promise.resolve([ethers.ZeroAddress]),
})

describe('dev-connection', () => {
	beforeEach(() => {
		render(html``, document.body)
		render(html`<dev-connection id=${ID}></dev-connection>`, document.body)
	})
	describe('Exposes eip1193Provider', () => {
		it('eip1193Provider is undefined by default', () => {
			const el = connection()
			expect(el.eip1193Provider.getValue()).to.be.equal(undefined)
		})
		it('eip1193Provider is BehaviorSubject', () => {
			const el = connection()
			let _count = 0
			el.eip1193Provider.subscribe(() => {
				_count = _count + 1
			})
			expect(el.eip1193Provider.getValue()).to.be.equal(undefined)

			const mock = {
				request: () => Promise.resolve(),
			}
			el.eip1193Provider.next(mock)

			expect(el.eip1193Provider.getValue()).to.be.equal(mock)
			expect(_count).to.be.equal(2)
		})
		it('when setEip1193Provider is called, eip1193Provider will update', async () => {
			const el = connection()
			expect(el.eip1193Provider.getValue()).to.be.equal(undefined)
			const mock = {
				request: () => Promise.resolve(),
			}

			el.setEip1193Provider(mock)

			await waitForUpdated(el.eip1193Provider)
			expect(el.eip1193Provider.getValue()).to.be.equal(mock)
		})
		it('when setEip1193Provider is called with BrowserProvider constructor, signer will update', async () => {
			const el = connection()
			expect(el.signer.getValue()).to.be.equal(undefined)

			const mock = {
				request: () => Promise.resolve(),
			}
			const signer = new ethers.VoidSigner(ethers.ZeroAddress)

			el.setEip1193Provider(mock, function () {
				return { getSigner: async () => signer }
			} as any)

			await waitForUpdated(el.signer)
			expect(el.signer.getValue()).to.be.equal(signer)
		})
		describe('EIP-1193 events listener', () => {
			const mockFc = (_e: string) => {
				let fn: any
				return {
					request: () => Promise.resolve(),
					on(e: string, f: any) {
						if (e === _e) fn = f
					},
					removeListener(e: string, f: any) {
						if (e === _e) fn = null
					},
					emit(e: string, args: any) {
						if (e === _e) fn && fn(args)
					},
				}
			}

			it('when setEip1193Provider is called, listen chainChanged event and update chain stream', async () => {
				const el = connection()
				expect(el.chain.getValue()).to.be.equal(undefined)

				const mock = mockFc('chainChanged')

				el.setEip1193Provider(mock)

				mock.emit('chainChanged', 123n)

				await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
				expect(el.chain.getValue()).to.be.equal(123)
			})
			it('when setEip1193Provider is called, remove chainChanged listener for previous provider', async () => {
				const el = connection()
				expect(el.chain.getValue()).to.be.equal(undefined)

				const mock1 = mockFc('chainChanged')
				const mock2 = mockFc('chainChanged')

				el.setEip1193Provider(mock1)
				el.setEip1193Provider(mock2)

				mock2.emit('chainChanged', 456n)
				mock1.emit('chainChanged', 123n)

				await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
				expect(el.chain.getValue()).to.be.equal(456)
			})
			it('when setEip1193Provider is called, listen accountsChanged event and update account stream', async () => {
				const el = connection()
				expect(el.account.getValue()).to.be.equal(undefined)

				const mock = mockFc('accountsChanged')

				el.setEip1193Provider(mock)

				mock.emit('accountsChanged', ['1', '2', '3'])

				await waitForUpdated(el.account.pipe(filter((x) => x !== undefined)))
				expect(el.account.getValue()).to.be.equal('1')
			})
			it('when setEip1193Provider is called, remove accountsChanged listener for previous provider', async () => {
				const el = connection()
				expect(el.account.getValue()).to.be.equal(undefined)

				const mock1 = mockFc('accountsChanged')
				const mock2 = mockFc('accountsChanged')

				el.setEip1193Provider(mock1)
				el.setEip1193Provider(mock2)

				mock2.emit('accountsChanged', ['4', '5', '6'])
				mock1.emit('accountsChanged', ['1', '2', '3'])

				await waitForUpdated(el.account.pipe(filter((x) => x !== undefined)))
				expect(el.account.getValue()).to.be.equal('4')
			})
			it('when setEip1193Provider is called, listen disconnect event and update signer stream', async () => {
				const el = connection()
				const signer = new ethers.VoidSigner(ethers.ZeroAddress)
				el.signer.next(signer)
				await waitForUpdated(el.signer.pipe(filter((x) => x !== undefined)))
				expect(el.signer.getValue()).to.be.equal(signer)

				const mock = mockFc('disconnect')

				el.setEip1193Provider(mock)

				mock.emit('disconnect', [])

				await waitForUpdated(el.signer.pipe(filter((x) => x === undefined)))
				expect(el.signer.getValue()).to.be.equal(undefined)
			})
			it('when setEip1193Provider is called, remove disconnect listener for previous provider', async () => {
				const el = connection()
				const signer = new ethers.VoidSigner(ethers.ZeroAddress)
				el.signer.next(signer)
				await waitForUpdated(el.signer)
				expect(el.signer.getValue()).to.be.equal(signer)

				const mock1 = mockFc('disconnect')
				const mock2 = mockFc('disconnect')

				el.setEip1193Provider(mock1)
				el.setEip1193Provider(mock2)

				mock2.emit('disconnect', [])

				await waitForUpdated(el.signer)
				expect(el.signer.getValue()).to.be.equal(undefined)

				el.signer.next(signer)

				await waitForUpdated(el.signer)
				expect(el.signer.getValue()).to.be.equal(signer)

				mock1.emit('disconnect', [])

				await new Promise((resolve) => setTimeout(resolve, 100))
				expect(el.signer.getValue()).to.be.equal(signer)
			})
		})
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
				new ethers.JsonRpcProvider(rpcEndpoints[0]),
			)
			el.signer.next(mock)

			expect(el.signer.getValue()).to.be.equal(mock)
			expect(_count).to.be.equal(2)
		})
		it('when signer is changed, account will update', async () => {
			const el = connection()
			expect(el.account.getValue()).to.be.equal(undefined)

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.JsonRpcProvider(rpcEndpoints[0]),
			)
			el.signer.next(mock)

			await waitForUpdated(el.account)
			expect(el.account.getValue()).to.be.equal(await mock.getAddress())
		})
		it('when signer is changed to undefined, account will update to undefined', async () => {
			const el = connection()

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.JsonRpcProvider(rpcEndpoints[0]),
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
				new ethers.JsonRpcProvider(rpcEndpoints[0]),
			)
			el.signer.next(mock)
			expect(el.provider.getValue()).to.be.equal(mock.provider)

			el.signer.next(undefined)

			expect(el.provider.getValue()).to.be.equal(undefined)
		})
		it('when signer is changed, provider will update', async () => {
			const el = connection()
			expect(el.provider.getValue()).to.be.equal(undefined)

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.JsonRpcProvider(rpcEndpoints[0]),
			)
			el.signer.next(mock)

			expect(el.provider.getValue()).to.be.equal(mock.provider)
		})
		it('when signer is changed and the provider is not set, provider will update to undefined', async () => {
			const el = connection()
			const d = new ethers.JsonRpcProvider(rpcEndpoints[1])
			el.provider.next(d)
			expect(el.provider.getValue()).to.be.equal(d)

			const _mock = ethers.Wallet.createRandom().connect(
				ethers.getDefaultProvider(1),
			)
			const mock = {
				..._mock,
				...mockProvider(null),
			}
			el.signer.next(mock as any)

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

			const mock = new ethers.JsonRpcProvider(rpcEndpoints[0])
			el.provider.next(mock)

			expect(el.provider.getValue()).to.be.equal(mock)
			expect(_count).to.be.equal(2)
		})
		it('when provider is changed, chain will update', async () => {
			const el = connection()
			expect(el.chain.getValue()).to.be.equal(undefined)

			const mock = new ethers.JsonRpcProvider(rpcEndpoints[0])
			el.provider.next(mock)

			await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
			expect(el.chain.getValue()).to.be.equal(42161)
		})
		it('when provider is changed to undefined, chain will update to undefined', async () => {
			const el = connection()
			const mock = new ethers.JsonRpcProvider(rpcEndpoints[0])
			el.provider.next(mock)

			await waitForUpdated(el.chain.pipe(filter((x) => x !== undefined)))
			expect(el.chain.getValue()).to.be.equal(42161)

			el.provider.next(undefined)
			await waitForUpdated(el.chain.pipe(filter((x) => x === undefined)))

			expect(el.chain.getValue()).to.be.equal(undefined)
		})
	})
})
