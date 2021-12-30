import { customElements } from '@aggre/ullr'
import { stakeOnMeButton } from '.'

window.customElements.define(
	'stake-on-me',
	customElements(
		([address, network]) => stakeOnMeButton({ address, network }),
		['address', 'network']
	)
)
