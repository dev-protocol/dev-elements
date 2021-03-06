import { html } from 'lit'
import { shadow } from '@aggre/ullr'
import { DirectiveResult } from 'lit/directive'

export const showNetwork = (net?: string): DirectiveResult =>
	shadow(html`<span class="text-base">${net}</span>`)
