import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import multiEntry from '@rollup/plugin-multi-entry'
import tailwind from './rollup.plugin.tw'
import glob from 'glob'

const files = glob.sync('src/**/element.ts')

export const createOptions = (file) => ({
	input: file,
	output: {
		file: `bundled/${file.replace(/.*(dev-(\w|-)*).*/, '$1')}.mjs`,
		format: 'es',
	},
	plugins: [
		typescript(),
		resolve(),
		commonjs(),
		multiEntry(),
		tailwind({
			include: 'src/**/*',
		}),
	],
})

export default files.map(createOptions)
