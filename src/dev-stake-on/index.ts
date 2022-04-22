import { html, TemplateResult } from 'lit'
import { showAddress } from './showAddress'
import { showNetwork } from './showNetwork'

export const stakeOnButton = ({
	address,
	network,
}: {
	readonly address: string | null
	readonly network: string | null
}): TemplateResult =>
	html`<style tailwind></style
		><button class="shadow">
			${showAddress(address)}${showNetwork(network)}
		</button>`
