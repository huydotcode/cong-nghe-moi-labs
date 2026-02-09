# Node.js DynamoDB CRUD Application

A simple MVC application for managing Products using Node.js, Express, EJS, and DynamoDB Local on Docker.

## Project Structure

- `src/app.js`: Main application entry point.
- `src/config/db.js`: DynamoDB connection configuration.
- `src/controllers/productController.js`: Business logic for handling requests.
- `src/models/productModel.js`: Data access layer for DynamoDB.
- `src/routes/productRoutes.js`: Route definitions.
- `src/views/`: EJS templates for the UI.
- `docker-compose.yml`: Docker services configuration.

## Prerequisites

- Docker and Docker Compose installed.
- Node.js (optional, if running locally without Docker).

## How to Run

1.  **Start the services**:

    ```bash
    docker-compose up -d --build
    ```

2.  **Initialize the Database Table**:
    (Run this once after starting the containers for the first time)

    ```bash
    docker-compose exec app npm run init-db
    ```

3.  **Access the Application**:
    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

4.  **DynamoDB Admin UI** (Optional):
    You can view and manage your DynamoDB tables at [http://localhost:8001](http://localhost:8001).

## Environment Variables

The `.env` file (or `docker-compose.yml` environment section) contains:

- `AWS_REGION`: AWS Region (e.g., us-west-2).
- `DYNAMODB_ENDPOINT`: URL for DynamoDB Local (default: `http://dynamodb-local:8000`).

## Features

- **Create**: Add new products with Name, Price, and Image URL.
- **Read**: View list of all products.
- **Update**: Edit existing products.
- **Delete**: Remove products.
