import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import multiEntry from '@rollup/plugin-multi-entry'
import tailwind from './rollup.plugin.tw'

const files = ['src/dev-stake-on/element.ts', 'src/dev-connection/element.ts']

export const createOptions = (file) => ({
	input: file,
	output: {
		file: `dist/${file}.js`,
		format: 'es',
	},
	plugins: [
		typescript(),
		resolve(),
		commonjs(),
		multiEntry(),
		tailwind({
			include: 'src/**/*',
			placeholder: '@tailwind;',
		}),
	],
})

export default files.map(createOptions)
