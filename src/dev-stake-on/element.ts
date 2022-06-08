import { createCustomElements } from '@aggre/ullr'
import { html } from 'lit'
import { stakeOnButton } from './index'
;((): void => {
	window.customElements.define(
		'dev-stake-on',
		createCustomElements(
			([address, network]) => html`<style tailwind></style>${stakeOnButton({
					address,
					network,
				})}`,
			['address', 'network']
		)
	)
})()
