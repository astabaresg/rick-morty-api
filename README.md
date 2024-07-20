# Rick and Morty Character Search API

## Description

This project is an API that allows searching for characters from the "Rick and Morty" series using the public Rick and Morty API and implementing GraphQL. The API caches search results to improve performance and also stores character information in a relational database.

## Features

- Search for "Rick and Morty" characters using GraphQL.
- Filter characters by:
  - Status
  - Species
  - Gender
  - Name
  - Origin
- Connect the API to a relational database using Sequelize and perform database setup through migrations.
- Implement connection to Redis to cache search results and improve performance.
- Populate the database initially with 15 characters from the Rick and Morty API.
- Middleware to log relevant information for each request.
- Decorator to log execution time of queries.
- Cron job to update database characters every 12 hours if there are any changes.
- Unit tests for the character search query.

## Technologies

- Node.js
- TypeScript
- Express
- Apollo Server
- GraphQL
- Sequelize
- PostgreSQL
- Redis
- Jest (for testing)
- Winston (for logging)

## Requirements

- Node.js (v14 or higher)
- Docker and Docker Compose (for running PostgreSQL and Redis)
- NPM or Yarn

## Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/rick-and-morty-api.git
cd rick-and-morty-api
```

2. Install dependencies:

```sh
npm install
```

3. Duplicates the .env.template file and configure the environment variables
4. Run Docker Compose to start PostgreSQL and Redis instances:

```sh
docker-compose up -d
```

## Usage

1. Start the development server:

```sh
npm run dev
```

2. The API will be available at http://localhost:3000/graphql. You can use GraphQL Playground or Postman to test the queries.

## GraphQL Queries

You can search for characters using the following query:

```graphql
query {
  characters(
    name: "Rick"
    status: "Alive"
    species: "Human"
    gender: "Male"
    origin: "Earth"
  ) {
    id
    name
    status
    species
    gender
    origin
  }
}
```

## Logging Middleware

The middleware logs relevant information for each request and prints it to the console.

## Execution Time Decorator

The `@logExecutionTime` decorator measures and logs the execution time of queries.

## Cron Job

The cron job runs every 12 hours to update the characters in the database if there are any changes in the character data.

## Testing

Run the unit tests:

```sh
npm test
```

## Author

- Álvaro Sebastián Tabares Gaviria - [@astabaresg](https://github.com/astabaresg)
