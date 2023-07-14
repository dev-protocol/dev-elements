import { expect } from '@esm-bundle/chai'
import { html, render } from 'lit'
import { stakeOnButton } from '.'
import { shadowSelector } from '../lib/test'

describe('Stake On Me Button', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('This is an example test', () => {
		render(
			stakeOnButton({ address: 'address', network: 'network' }),
			document.body,
		)
		const button = document.body.querySelector('button')
		expect(button).to.not.equal(null)

		const addr = shadowSelector('span', button?.querySelector('*:first-child'))
		expect(addr?.textContent).to.be.equal('address')

		const net = shadowSelector('span', button?.querySelector('*:last-child'))
		expect(net?.textContent).to.be.equal('network')
	})
})
