import { FastifyInstance } from "fastify";
import config from "@app/config";

export default class Server {
  public appConfig;

  constructor(public app: FastifyInstance) {
    this.appConfig = config.app;
  }

  public async start() {
    if (["development", "production"].includes(this.appConfig.env)) {
      await this.app.listen(this.appConfig.port);
      console.log(`🚀 Server ready at http://localhost:${this.appConfig.port}`);
    }
  }
}
