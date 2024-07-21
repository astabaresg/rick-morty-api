import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";

/**
 * Middleware function to log incoming requests.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const timeStamp = new Date().toISOString();

  logger.info(`${method} request to ${url} at ${timeStamp}`);

  if (method === "POST" && req.is("application/json") && req.body) {
    const { query, operationName } = req.body;
    logger.info(`GraphQL Query: ${query}`);
    logger.info(`GraphQL Operation Name: ${operationName}`);
  } else {
    logger.info(`Query Parameters: ${JSON.stringify(req.query)}`);
    logger.info(`Body: ${JSON.stringify(req.body)}`);
  }

  next();
};

export default requestLogger;
