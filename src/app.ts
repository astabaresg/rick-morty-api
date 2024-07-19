import { envs } from "./config/envs";
import logger from "./config/logger";
import redisClient from "./config/redis";
import { createConnection } from "./data/sequelize/database";
import populateDatabase from "./infraestructure/services/populate";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  const server = new Server({
    port: envs.PORT,
  });

  server.start();

  // Establish database connection
  createConnection().then(async () => {
    // Populate initial data if needed
    await populateDatabase();
  });

  // Connect to Redis
  redisClient
    .connect()
    .then(() => {
      logger.info("Connected to Redis");
    })
    .catch((err) => {
      logger.error("Redis connection error:", err);
    });
}
