import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import requestLogger from "../infraestructure/middlewware/logger";
import schema from "../infraestructure/schemas";
import logger from "../config/logger";

interface Options {
  port: number;
}

/**
 * Represents a server that handles HTTP requests and starts an Apollo Server.
 */
export class Server {
  /**
   * The Express application instance.
   */
  public readonly app = express();

  /**
   * The port number on which the server listens for incoming requests.
   */
  private readonly port: number;

  /**
   * The Apollo Server instance.
   */
  public readonly server: ApolloServer = new ApolloServer({ schema });

  /**
   * Creates a new Server instance.
   * @param options - The options for configuring the server.
   */
  constructor(options: Options) {
    this.port = options.port;
  }

  /**
   * Starts the server and listens for incoming requests.
   */
  async start() {
    await this.server.start();

    //* Middlewares
    this.app.use(json());
    this.app.use(requestLogger);
    this.app.use("/graphql", json(), expressMiddleware(this.server));

    this.app.listen(this.port, () => {
      logger.info(`Server running at http://localhost:${this.port}/graphql`);
    });
  }
}
