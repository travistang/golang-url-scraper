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
  - `task-details.spec.ts` - Task details page tests
- `tests/fixtures/` - Test data and constants
- `tests/utils/` - Helper functions for common operations

## Configuration

The tests are configured to:

- Start both frontend (port 3000) and backend (port 8080) automatically
- Run tests in parallel across multiple browsers (Chrome, Firefox, Safari)
- Capture screenshots and videos on failures
- Generate HTML reports

## Test Data

Test data is defined in `tests/fixtures/test-data.ts` and includes:

- Test user credentials
- Sample URLs for testing
- Expected task statuses

## Writing New Tests

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Import test helpers from `tests/utils/test-helpers.ts`
3. Use test data from `tests/fixtures/test-data.ts`
4. Follow the existing test patterns and naming conventions

## CI/CD Integration

The tests are configured to run in CI environments with:

- Reduced retries and workers
- Headless mode
- No reuse of existing servers
