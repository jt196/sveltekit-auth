import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'node scripts/web-server.js',
		port: 4173
	},
	testDir: 'e2e',
	globalSetup: './e2e/global-setup.js',
	reporter: [
		['list'],
		['html', { outputFolder: 'logs/playwright-report', open: 'never' }],
		['json', { outputFile: 'logs/playwright-report.json' }]
	],
	outputDir: 'logs/playwright-artifacts',
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	}
});
