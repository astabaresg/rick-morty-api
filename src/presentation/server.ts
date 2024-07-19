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

export class Server {
  public readonly app = express();
  private readonly port: number;
  public readonly server: ApolloServer = new ApolloServer({ schema });

  constructor(options: Options) {
    this.port = options.port;
  }

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
