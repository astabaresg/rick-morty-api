import { Dialect, Sequelize } from "sequelize";
import { envs } from "./envs";

const sequelize = new Sequelize(
  envs.DB_NAME!,
  envs.DB_USER!,
  envs.DB_PASSWORD!,
  {
    host: envs.DB_HOST,
    dialect: "postgres" as Dialect,
  }
);

export const createConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default sequelize;
