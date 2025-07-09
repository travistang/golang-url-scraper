# Golang URL Scraper

This server provides functionality for creating and deleting tasks for crawling specified URLs, reporting and searching for task results as well as starting and stopping the crawler.

## Quick Start

### Run locally

To run the server locally, you need to meet the following pre-requisites:

- You have Golang installed
- You have a MySQL database running locally / accessible through network

Assuming that your shell's current directory is where this README locates at (`<project_root>/backend`), just run the following:

```bash
go mod download
go build -o server
DATABASE_URL=<connection_string_to_MySQL_database> ./server
```

The server should be listening to port `8080`, you can verify it by getting a 200 response from hitting its `/health` healthcheck endpoint:

```bash
curl localhost:8080/health # {"status":"healthy"}
```

## API endpoints

This server exposes the following endpoints:

### Authentication

- `POST /api/login`: Authenticate and get a token
  - **Request Body**: `{"username": "string", "password": "string"}`
  - **Response**: `{"message": "Login successful", "token": "Basic base64(username:password)"}`

### Health Check

- `GET /health`: Health check endpoint
  - **Response**: `{"status": "healthy"}`

### Tasks

All task endpoints require Basic Authentication using the token received from the login endpoint.

- `GET /api/v1/tasks`: Search and list tasks

  - **Query Parameters**:
    - `page` (int): Page number (default: 1)
    - `pageSize` (int): Items per page (default: 20, max: 100)
    - `sortBy` (string): Sort field (default: "submittedAt")
    - `sortOrder` (string): Sort direction - "asc" or "desc" (default: "desc")
    - `status` (string): Filter by status - "pending", "running", "completed", "failed"
    - `url` (string): Filter by URL (partial match)
    - `globalSearch` (string): Search across URL, ID, page title, and HTML version
    - `submittedAfter` (datetime): Filter tasks submitted after this time
    - `submittedBefore` (datetime): Filter tasks submitted before this time
    - `hasResult` (boolean): Filter tasks that have results
    - `pageTitle` (string): Filter by page title (partial match)
    - `htmlVersion` (string): Filter by HTML version (partial match)
    - `hasLoginForm` (boolean): Filter by presence of login form
    - `minInternalLinks`/`maxInternalLinks` (int): Filter by internal link count range
    - `minExternalLinks`/`maxExternalLinks` (int): Filter by external link count range
    - `minH1Count`/`maxH1Count` (int): Filter by H1 count range
    - `minH2Count`/`maxH2Count` (int): Filter by H2 count range
    - `minH3Count`/`maxH3Count` (int): Filter by H3 count range
    - `minH4Count`/`maxH4Count` (int): Filter by H4 count range
    - `minH5Count`/`maxH5Count` (int): Filter by H5 count range
    - `minH6Count`/`maxH6Count` (int): Filter by H6 count range
  - **Response**: `{"tasks": [...], "total": int, "page": int, "limit": int}`

- `POST /api/v1/tasks`: Create a new task

  - **Request Body**: `{"url": "string"}`
  - **Response**: Created task object

- `DELETE /api/v1/tasks`: Bulk delete tasks

  - **Request Body**: `{"ids": ["string"]}`
  - **Response**: 204 No Content

- `POST /api/v1/tasks/rerun`: Bulk re-run tasks

  - **Request Body**: `{"ids": ["string"]}`
  - **Response**: 204 No Content

- `GET /api/v1/tasks/:id`: Get a specific task

  - **Response**: Task object

- `DELETE /api/v1/tasks/:id`: Delete a specific task

  - **Response**: 204 No Content

- `POST /api/v1/tasks/:id/start`: Start a task

  - **Description**: Start a task regardless of its status. If the task is running, this does nothing. Otherwise the current running task is interrupted and the scraper will work on this task instead.
  - **Response**: `{"message": "Task started"}`

- `POST /api/v1/tasks/:id/stop`: Stop a task
  - **Description**: Stop a task regardless of its status. If the task is not running or pending, this does nothing. Otherwise the task is marked as pending and the scraper will stop working on it. It will also be put at the end of the queue by setting request_processing_at to the current timestamp.
  - **Response**: `{"message": "Task stopped"}`

### Task Object Structure

```json
{
  "id": "string",
  "url": "string",
  "status": "pending|running|completed|failed",
  "submittedAt": "datetime",
  "requestProcessingAt": "int64|null",
  "startedAt": "datetime|null",
  "completedAt": "datetime|null",
  "htmlVersion": "string|null",
  "pageTitle": "string|null",
  "hasLoginForm": "boolean|null",
  "h1Count": "int|null",
  "h2Count": "int|null",
  "h3Count": "int|null",
  "h4Count": "int|null",
  "h5Count": "int|null",
  "h6Count": "int|null",
  "internalLinks": "int|null",
  "externalLinks": "int|null",
  "inaccessibleLinks": [
    {
      "url": "string",
      "statusCode": "int"
    }
  ]
}
```
