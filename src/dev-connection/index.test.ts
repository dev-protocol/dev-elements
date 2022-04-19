import { expect } from '@esm-bundle/chai'
import { ethers } from 'ethers'
import { DevConnectionElement } from './index'
import { define } from '@aggre/ullr'
import { html, render } from 'lit'
import { rpcEndpoints } from '../lib/test'
import { filter } from 'rxjs'

define(DevConnectionElement)

const ID = 'connection'
const connection = (): DevConnectionElement =>
	document.getElementById(ID) as DevConnectionElement

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

			await new Promise((res) =>
				el.account.pipe(filter((x) => x !== undefined)).subscribe(res)
			)
			expect(el.account.getValue()).to.be.equal(await mock.getAddress())
		})
		it('when signer is changed, provider will update', async () => {
			const el = connection()
			expect(el.provider.getValue()).to.be.equal(undefined)

			const mock = ethers.Wallet.createRandom().connect(
				new ethers.providers.JsonRpcProvider(rpcEndpoints[0])
			)
			el.signer.next(mock)

			await new Promise((res) =>
				el.provider.pipe(filter((x) => x !== undefined)).subscribe(res)
			)
			expect(el.provider.getValue()).to.be.equal(await mock.provider)
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

			await new Promise((res) =>
				el.chain.pipe(filter((x) => x !== undefined)).subscribe(res)
			)
			expect(el.chain.getValue()).to.be.equal(42161)
		})
	})
})
