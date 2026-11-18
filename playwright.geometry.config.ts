import {defineConfig, devices} from '@playwright/test';
import app from './playwright.app.config';

// The same real Meteor gesture and full save/reload are exercised in each
// browser. The ordinary app suite keeps its existing Chromium configuration.
export default defineConfig({
  ...app,
  testMatch:'**/app-rotate-middrag.spec.ts',
  projects:[
    {name:'meteor-chromium',use:{...devices['Desktop Chrome']}},
    {name:'meteor-firefox',use:{...devices['Desktop Firefox']}},
    {name:'meteor-webkit',use:{...devices['Desktop Safari']}},
  ],
});
