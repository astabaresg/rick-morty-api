import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  DB_NAME: get("POSTGRES_DB").required().asString(),
  DB_USER: get("POSTGRES_USER").required().asString(),
  DB_PASSWORD: get("POSTGRES_PASSWORD").required().asString(),
  DB_HOST: get("POSTGRES_URL").required().asString(),
  DB_PORT: get("POSTGRES_PORT").required().asPortNumber(),
  REDIS_HOST: get("REDIS_HOST").required().asString(),
  REDIS_PORT: get("REDIS_PORT").required().asPortNumber(),
};
