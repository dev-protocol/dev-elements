/* eslint-disable functional/no-expression-statement */
import { define } from '@aggre/ullr'
import { Connection } from '.'

export const getConnection = (id: string): Connection => {
	define(Connection)
	const el =
		getConnection(id) ??
		((e) => {
			e.setAttribute('id', id)
			document.body.appendChild(e)
			return e
		})(document.createElement(Connection.is))
	return el as Connection
}
