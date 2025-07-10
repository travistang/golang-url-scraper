# URL Scraper Application

A full-stack web application for scraping and analyzing URLs. The application consists of a Next.js frontend and a Go backend service that provides URL scraping functionality with detailed analytics.

## Project Structure

```
├── app/          # Next.js frontend application
├── backend/      # Go backend service
├── e2e/          # End-to-end tests
└── docker-compose.yml  # Docker setup for all services
```

## Prerequisites

- **Node.js** (v18 or higher)
- **Go** (v1.21 or higher)
- **MySQL** (v8.0 or higher)
- **Docker & Docker Compose** (for containerized deployment)

## Quick Start with Docker (Recommended)

The easiest way to run the entire application:

```bash
# Clone the repository
git clone <repository-url>
cd golang-url-scraper

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Database: localhost:13306
```

**The username and password is _admin_ and _password_ respectively**

## Local Development Setup

### 1. Backend Setup

```bash
cd backend

# Install Go dependencies
go mod download

# Set up MySQL database
# Create a database named 'url_scraper'

# Build and run the backend
go build -o server
DATABASE_URL="user:password@tcp(localhost:3306)/url_scraper?parseTime=true" ./server
```

The backend will be available at `http://localhost:8080`

### 2. Frontend Setup

```bash
cd app

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# JWT_SECRET=your-secret-key
# BACKEND_URL=http://localhost:8080

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Development Commands

### Frontend (app directory)

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend (backend directory)

```bash
go run main.go   # Run in development mode
go build -o server  # Build executable
go test ./...    # Run tests
```

## Environment Variables

### Frontend (.env.local)
```
JWT_SECRET=your-secret-key-here
BACKEND_URL=http://localhost:8080
```

### Backend
```
DATABASE_URL=user:password@tcp(localhost:3306)/url_scraper?parseTime=true
```

## API Endpoints

The backend provides the following main endpoints:

- `POST /api/login` - Authentication
- `GET /api/v1/tasks` - List/search tasks
- `POST /api/v1/tasks` - Create new scraping task
- `GET /api/v1/tasks/:id` - Get task details
- `POST /api/v1/tasks/:id/start` - Start task
- `POST /api/v1/tasks/:id/stop` - Stop task

For detailed API documentation, see the [backend README](./backend/README.md).

## Features

- **URL Scraping**: Submit URLs for analysis
- **Task Management**: Create, monitor, and manage scraping tasks
- **Analytics**: Detailed analysis including:
  - Page title and HTML version
  - Link counts (internal/external)
  - Heading structure (H1-H6 counts)
  - Login form detection
  - Inaccessible links reporting
- **Real-time Updates**: Monitor task progress in real-time
- **Search & Filtering**: Advanced search and filtering capabilities

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure MySQL is running and accessible
2. **Port Conflicts**: Check if ports 3000, 8080, or 13306 are already in use
3. **CORS Issues**: Verify BACKEND_URL is correctly set in frontend environment
4. **Authentication**: Ensure JWT_SECRET is properly configured


## Brief explanation of design principle

### Authentication:
The authentication flow goes as follows:
- User inputs credentials
- POST request is submitted to the Next.js `/api/login` endpoint
- The endpoint would in turn validates credentials in the Golang server's `/login` endpoint
- If login is successful, the latter endpoint would return an Authorization Header `Basic <base64_encoded_credentials>`
- The Next.js endpoint would then sign a JWT with the token being this header and set it in the cookie of the response

Subsequently:
- User sends request, browser provides the signed JWT in cookie
- The requests first go through next.js API endpoints, which is then proxied to Golang's server (as a result, CORS is resolved)
- Inside the Next.js API handlers, the JWT in the cookie is decoded and being added to the `Authorization` header in the proxy requests to the Golang's server
- The response is passed back to the client

_Note: only `/api/v1/*` endpoints are secured with auth middleware, headers of requests sent to `/health` and `/login` will not be examined._

Internal (`/tasks` / `/tasks/[id]`) pages protection:
- The pages are rendered on server side.
- It will first extract the token from the cookies sent by the browser, make an request to gather initial data to render (first page of the task list for `/tasks`, or task details for `/tasks/[id]`)
- If this request fails (mostly because of authorization error, but could be because the backend / database is down), user would be redirected to login page instead of seeing the page
- Otherwise user would see the internal page, with initial data pre-fetched.

### Backend:

Worker:
- A Go routine is spawned alongside with the server that acts as the worker to take up tasks and perform scraping.
- The worker checks for tasks in pending state, sorted by `requestSubmittedAt` field
- Worker then launches crawler to gather information, and update the database via `TaskRepository`

Start / Stop:
- When user invokes start / stop endpoints, the endpoint would notify worker to set `interrupt` flag to `true` to stop the crawler from further processing, regardless of whether the tasks in question is the current one that's running.
- If it's a `stop` operation, then the `requestSubmittedAt` task being stopped would be assigned to the current timestamp, effectively put it back to the end of the processing queue.
- If it's a `start` operation, then the `requestSubmittedAt` of the task being started would be set to 0, effectively put it at the start of the queue.
- The crawler would then be resumed (setting `interrupt` to `false`), and the next task (if a task is started, then that task would be the next; If a task is being stopped, then it won't be the next task unless there's only one task pending)
