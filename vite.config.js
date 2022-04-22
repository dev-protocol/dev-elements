import { defineConfig } from 'vite'

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /\.(\/src\/)(.*\/element\.ts)/,
				replacement: './dist$1$2.js',
			},
		],
	},
})
