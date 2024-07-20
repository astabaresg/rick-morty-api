import { Dialect, Sequelize } from "sequelize";
import { envs } from "../../config/envs";
import logger from "../../config/logger";

const sequelize = new Sequelize(
  envs.DB_NAME!,
  envs.DB_USER!,
  envs.DB_PASSWORD!,
  {
    host: envs.DB_HOST,
    dialect: "postgres" as Dialect,
    logging: false,
  }
);

export const createConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
};

export const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info("Connection to the database has been closed successfully.");
  } catch (error) {
    logger.error("Unable to close the database connection:", error);
  }
};

export default sequelize;
