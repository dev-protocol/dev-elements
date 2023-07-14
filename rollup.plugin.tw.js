/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-conditional-statement */
import { createFilter } from '@rollup/pluginutils'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

function transform(purgeFiles) {
	const plugins = [
		tailwindcss({
			config: { content: [...purgeFiles], separator: ':' },
		}),
		autoprefixer,
	]
	return postcss(plugins).process('@tailwind utilities;', {
		from: undefined,
		to: undefined,
	})
}

const defaultOptions = {
	include: undefined,
	exclude: undefined,
}
const placeholder = '<style tailwind>'

export default function litTailwindcss(options = defaultOptions) {
	const filter = createFilter(options.include, options.exclude)
	const ids = new Set()

	return {
		moduleParsed({ id }) {
			if (filter(id)) ids.add(id)
		},
		async renderChunk(code) {
			if (code.includes(placeholder)) {
				const result = await transform(Array.from(ids))
				if (result.css) {
					return code.replace(
						placeholder,
						`<style>${result.css.replace(/:/g, '\\:')}`,
					)
				}
				return null
			}
			return null
		},
	}
}
