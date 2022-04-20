import { DevConnectionElement } from '.'

export const getConnection = (id: string): DevConnectionElement | undefined => {
	const el = document.getElementById(id)
	return el ? (el as DevConnectionElement) : undefined
}
