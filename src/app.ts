import { envs } from "./config/envs";
import logger from "./config/logger";
import redisClient from "./config/redis";
import { createConnection } from "./data/sequelize/database";
import populateDatabase from "./infraestructure/services/populate.service";
import { Server } from "./presentation/server";
import "./infraestructure/cron/update-characters.cron";
import { seedLocations } from "./infraestructure/services/location.service";

(async () => {
  main();
})();

/**
 * The main function that starts the application.
 * It initializes the server, establishes a database connection,
 * populates initial data if needed, and connects to Redis.
 */
async function main() {
  const server = new Server({
    port: envs.PORT,
  });

  server.start();

  // Establish database connection
  createConnection().then(async () => {
    // Populate initial data if needed
    await seedLocations();
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
