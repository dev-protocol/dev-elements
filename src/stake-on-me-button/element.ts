import { createCustomElements } from '@aggre/ullr'
import { stakeOnMeButton } from './index'

window.customElements.define(
	'stake-on-me',
	createCustomElements(
		([address, network]) => stakeOnMeButton({ address, network }),
		['address', 'network']
	)
)
