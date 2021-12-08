import { FastifyInstance } from "fastify";

import Container from "@root/app/server/container";

export class CreateApp {
  public app: FastifyInstance;

  private container: Container;

  constructor() {
    this.container = new Container();

    this.app = this.container.app;
  }

  public async initServer() {
    await this.container.load();
  }

  public async stopServer() {
    await this.app.close();
  }
}
