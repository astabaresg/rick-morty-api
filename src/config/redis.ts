import { createClient } from "redis";
import dotenv from "dotenv";
import { envs } from "./envs";

dotenv.config();

const redisClient = createClient({
  url: `redis://${envs.REDIS_HOST}:${envs.REDIS_PORT}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export default redisClient;
