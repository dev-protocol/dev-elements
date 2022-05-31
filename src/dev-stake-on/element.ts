import { createCustomElements } from '@aggre/ullr'
import { stakeOnButton } from './index'
;((): void => {
	window.customElements.define(
		'dev-stake-on',
		createCustomElements(
			([address, network]) => stakeOnButton({ address, network }),
			['address', 'network']
		)
	)
})()
