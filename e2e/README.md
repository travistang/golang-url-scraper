# E2E Tests

This directory contains end-to-end tests for the URL Scraper application using Playwright.

## Prerequisites

- Node.js 18+ installed
- Go 1.21+ installed (for backend)
- Both frontend and backend should be running locally (running `docker compose up` should suffice)
- Make sure that the frontend is accessible at `http://localhost:3000`
## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npm run install-browsers
```
_Note: in some cases you need to run `sudo npx playwright install-deps` to install dependencies for playwrights if you don't have it set up on your device_

## Running Tests

### All Tests

```bash
npm test
```

### Interactive Mode (UI)

```bash
npm run test:ui
```

### Headed Mode (see browser)

```bash
npm run test:headed
```

### Debug Mode

```bash
npm run test:debug
```

### View Reports

```bash
npm run report
```

## Test Structure

- `tests/e2e/` - Main test files
  - `auth.spec.ts` - Authentication tests
  - `tasks.spec.ts` - Task management tests
- `tests/fixtures/` - Test data and constants
- `tests/utils/` - Helper functions for common operations

