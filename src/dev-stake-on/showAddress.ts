import { html } from 'lit'
import { shadow } from '@aggre/ullr'
import { DirectiveResult } from 'lit/directive'

export const showAddress = (addr: string | null): DirectiveResult =>
	shadow(html`<span class="text-xs">${addr}</span>`)
