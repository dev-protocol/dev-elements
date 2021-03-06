import { html, TemplateResult } from 'lit'
import { showAddress } from './showAddress'
import { showNetwork } from './showNetwork'

export const stakeOnButton = ({
	address,
	network,
}: {
	readonly address?: string
	readonly network?: string
}): TemplateResult =>
	html`<button class="shadow">
		${showAddress(address)}${showNetwork(network)}
	</button>`
