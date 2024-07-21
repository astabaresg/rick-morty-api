import "dotenv/config";
import { get } from "env-var";

/**
 * Configuration object for environment variables.
 */
export const envs = {
  /**
   * The port number for the server.
   */
  PORT: get("PORT").required().asPortNumber(),

  /**
   * The name of the PostgreSQL database.
   */
  DB_NAME: get("POSTGRES_DB").required().asString(),

  /**
   * The username for connecting to the PostgreSQL database.
   */
  DB_USER: get("POSTGRES_USER").required().asString(),

  /**
   * The password for connecting to the PostgreSQL database.
   */
  DB_PASSWORD: get("POSTGRES_PASSWORD").required().asString(),

  /**
   * The host URL for the PostgreSQL database.
   */
  DB_HOST: get("POSTGRES_URL").required().asString(),

  /**
   * The port number for the PostgreSQL database.
   */
  DB_PORT: get("POSTGRES_PORT").required().asPortNumber(),

  /**
   * The host for the Redis server.
   */
  REDIS_HOST: get("REDIS_HOST").required().asString(),

  /**
   * The port number for the Redis server.
   */
  REDIS_PORT: get("REDIS_PORT").required().asPortNumber(),
};
