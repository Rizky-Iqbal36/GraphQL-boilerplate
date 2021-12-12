import { ApolloServer } from "apollo-server-fastify";
import { FastifyInstance } from "fastify";

import config from "@app/config";
import { apolloConfig } from "@app/apollo/apolloConfig";

export default class Server {
  public apolloServer: ApolloServer;
  public appConfig;

  constructor(public app: FastifyInstance) {
    this.apolloServer = new ApolloServer(apolloConfig(app));
    this.appConfig = config.app;
  }

  public async start() {
    await this.apolloServer.start();
    this.app.register(
      this.apolloServer.createHandler({ disableHealthCheck: true })
    );

    if (["development", "production"].includes(this.appConfig.env)) {
      await this.app.listen(this.appConfig.port);
      console.log(
        `🚀 Server ready at http://localhost:${this.appConfig.port}${this.apolloServer.graphqlPath}`
      );
    }
  }
}
