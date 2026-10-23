import { defineConfig } from '@playwright/test';
import { browserChannel } from './scripts/browser.mjs';
export default defineConfig({testDir:'./test/e2e',timeout:60000,use:{baseURL:'http://127.0.0.1:4173',channel:browserChannel,reducedMotion:'reduce'},webServer:{command:'node scripts/serve.mjs dist',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},reporter:'list'});
