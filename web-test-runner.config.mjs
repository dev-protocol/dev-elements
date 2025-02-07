import { esbuildPlugin } from '@web/dev-server-esbuild'
import { puppeteerLauncher } from '@web/test-runner-puppeteer'

export default {
	files: ['src/**/*.test.ts'],
	plugins: [esbuildPlugin({ ts: true })],
	browsers: [
		puppeteerLauncher({
			launchOptions: {
				args: ['-no-sandbox', '--disable-setuid-sandbox'],
			},
		}),
	],
	nodeResolve: true,
}
