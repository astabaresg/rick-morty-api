import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import { createConnection } from "./config/database";
import populateDatabase from "./services/populate";
import redisClient from "./config/redis";
import schema from "./schemas";

const app = express();
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({ schema });

// Start the Apollo server
async function startServer() {
  await server.start();
  app.use("/graphql", json(), expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();

// Establish database connection
createConnection().then(async () => {
  // Populate initial data if needed
  await populateDatabase();
});

// Connect to Redis
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });
