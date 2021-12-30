import { html, TemplateResult } from 'lit'
import { shadow } from '@aggre/ullr'
import { DirectiveResult } from 'lit/directive'

const showAddress = (addr: string | null): DirectiveResult =>
	shadow(
		html`<style>
				span {
					color: red;
				}</style
			><span>${addr}</span>`
	)
const showNetwork = (net: string | null): DirectiveResult =>
	shadow(html`<style>
			span {
				color: blue;
			}</style
		><span>${net}</span>`)

export const stakeOnMeButton = ({
	address,
	network,
}: {
	readonly address: string | null
	readonly network: string | null
}): TemplateResult =>
	html`<style>
			button {
				border: 0;
				padding: 1rem 1.2rem;
			}</style
		><button>${showAddress(address)}${showNetwork(network)}</button>`
