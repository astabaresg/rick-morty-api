import { createClient } from "redis";
import dotenv from "dotenv";
import { envs } from "./envs";
import logger from "./logger";

dotenv.config();

/**
 * Redis client instance.
 */
const redisClient = createClient({
  url: `redis://${envs.REDIS_HOST}:${envs.REDIS_PORT}`,
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

export default redisClient;
