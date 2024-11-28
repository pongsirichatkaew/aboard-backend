# A Board - Backend

This is the backend for the "A Board" application, a blogging platform where users can create, edit, and view posts.

## Features
User authentication and authorization (JWT-based)
REST API for managing posts and comments
Modular architecture for scalability
Error handling with global exception filters
Integration with a PostgreSQL database
Unit testing for critical modules


# How to start a project:

### Set Up Environment Variables
Copy .env.sample to .env in root directory

### Prerequisites
- Node.js (>=18.x.x)
- Docker and Docker Compose for running dependencies 

### Run a project with database setup
Note: Please do not use this Docker setup for real deployment just for development purpose.
```
docker-compose up --build
```
Once running, the application should restart when changes to the **JavaScript** are detected.

### (Optional) Run a project manually
```
npm install
```
The application can be started in development mode by running:
```
npm run start:dev
```

Once running, the application should restart when changes to the **JavaScript** are detected.

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

For coverage results
```bash
  npm run test:cov
```

