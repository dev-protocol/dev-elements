import { Connection } from '.'

export const getConnection = (id: string): Connection | undefined => {
	const el = document.getElementById(id)
	return el ? (el as Connection) : undefined
}
