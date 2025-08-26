import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview:logs',
		port: 4173
	},
	testDir: 'e2e',
	reporter: [
		['list'],
		['html', { outputFolder: 'logs/playwright-report', open: 'never' }]
	],
	outputDir: 'logs/playwright-artifacts',
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	}
});
