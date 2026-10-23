import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./test/e2e',use:{baseURL:'http://127.0.0.1:4173'},webServer:{command:'node scripts/serve.mjs dist',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},reporter:'list'});
