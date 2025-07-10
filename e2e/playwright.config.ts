import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
    // webServer: [
    //     {
    //         command: 'cd ../backend && go build -o main && DATABASE_URL="root:devpass@tcp(localhost:3306)/devdb?parseTime=true" ./main',
    //         url: 'http://localhost:8080',
    //         reuseExistingServer: !process.env.CI,
    //         timeout: 120 * 1000,
    //     },
    //     {
    //         command: 'cd ../app && npm run dev',
    //         url: 'http://localhost:3000',
    //         reuseExistingServer: !process.env.CI,
    //         timeout: 120 * 1000,
    //     },
    // ],
}); 