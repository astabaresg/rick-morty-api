import cron from "node-cron";
import logger from "../../config/logger";
import { updateCharactersInDatabase } from "../services/character.service";

// "0 */12 * * *" // Every 12 hours
// Every 5 minutes cron.schedule("*/5 * * * *", async () => {

cron.schedule("0 */12 * * *", async () => {
  logger.info("Running the character update job");
  await updateCharactersInDatabase();
});
