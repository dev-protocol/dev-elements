import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import multiEntry from '@rollup/plugin-multi-entry'
import dts from 'rollup-plugin-dts'

export default [
	{
		input: ['dist/**/*.test.js'],
		output: {
			file: 'dist/test.js',
			format: 'umd',
		},
		plugins: [resolve(), commonjs(), multiEntry()],
	},
	{
		input: ['dist/**/*.js', '!**/*.test.js', '!dist/src/lib/test.ts'],
		output: [
			{
				file: 'dist/index.mjs',
				format: 'es',
			},
			{
				file: 'dist/index.js',
				format: 'cjs',
			},
		],
		plugins: [multiEntry()],
	},
	{
		input: ['dist/**/*.d.ts', '!**/*.test.d.ts', '!dist/src/lib/test.d.ts'],
		output: [{ file: 'dist/index.d.ts', format: 'es' }],
		plugins: [multiEntry(), dts()],
	},
]
