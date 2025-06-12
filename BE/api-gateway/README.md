# API Gateway

This is a simple API Gateway implementation for the microservices architecture. It routes requests from the frontend to the appropriate microservices.

## Services

The API Gateway routes requests to the following services:

- User Service: `http://localhost:8080`
- Product Service: `http://localhost:8081`
- Order Service: `http://localhost:8082`

## API Routes

All routes are prefixed with `/api`:

- `/api/users/*` -> User Service
- `/api/products/*` -> Product Service
- `/api/orders/*` -> Order Service

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following content:
```
PORT=8000
USER_SERVICE_URL=http://localhost:8080
PRODUCT_SERVICE_URL=http://localhost:8081
ORDER_SERVICE_URL=http://localhost:8082
```

3. Run the API Gateway:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Health Check

You can check if the API Gateway is running by making a GET request to:
```
GET http://localhost:8000/health
``` 