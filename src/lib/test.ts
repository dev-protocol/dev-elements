/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-expression-statement */
import type { UndefinedOr } from '@devprotocol/util-ts'

export const sleep = async (time: number): Promise<void> =>
	new Promise(
		(resolve: (value?: void | PromiseLike<void> | undefined) => void): void => {
			setTimeout(resolve, time)
		}
	)

export const shadowSelector = (
	selector: string,
	element: UndefinedOr<Element | null>
): UndefinedOr<Element | null> => element!.shadowRoot!.querySelector(selector)

export const slotSelector = (
	slot: string,
	selector: string,
	element: Element | null
): Element | null | undefined => {
	if (element === null) {
		return
	}

	const { shadowRoot } = element
	const slotEl = (() => {
		if (shadowRoot !== undefined && shadowRoot !== null) {
			return shadowRoot
		}

		return element
	})().querySelector(slot)
	if (slotEl === null) {
		return
	}

	const [assigned] = (slotEl as HTMLSlotElement).assignedNodes()
	const { parentElement } = assigned
	if (parentElement === null) {
		return
	}

	return parentElement.querySelector(selector)
}

export const removeExtraString = (c: string): string =>
	c.replace(/<!--((?!-->)[\w\W])*-->/g, '').trim()

export const rpcEndpoints = [
	'https://arb1.arbitrum.io/rpc',
	'https://rinkeby.arbitrum.io/rpc',
]
