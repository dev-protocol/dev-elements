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
		input: [
			'dist/**/*.js',
			'!**/element.*',
			'!**/constants/*',
			'!**/*.test.js',
			'!**/test.js',
		],
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
		plugins: [resolve(), commonjs(), multiEntry()],
	},
	{
		input: [
			'dist/**/*.d.ts',
			'!**/element.*',
			'!**/constants/*',
			'!**/*.test.d.ts',
			'!dist/src/lib/test.d.ts',
		],
		output: [{ file: 'dist/index.d.ts', format: 'es' }],
		plugins: [resolve(), multiEntry(), dts()],
	},
	{
		input: 'dist/src/constants/index.js',
		output: [
			{
				file: 'dist/constants.mjs',
				format: 'es',
			},
			{
				file: 'dist/constants.js',
				format: 'cjs',
			},
		],
		plugins: [resolve()],
	},
	{
		input: 'dist/src/constants/index.d.ts',
		output: [{ file: 'dist/constants.d.ts', format: 'es' }],
		plugins: [resolve(), dts()],
	},
]
