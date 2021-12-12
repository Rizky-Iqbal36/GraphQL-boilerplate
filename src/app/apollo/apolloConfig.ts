import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServerFastifyConfig } from "apollo-server-fastify";
import { FastifyInstance } from "fastify";

import { typeDefs, resolvers } from "@root/schema";

const apolloConfig = (app: FastifyInstance): ApolloServerFastifyConfig => {
  return {
    typeDefs,
    resolvers,
    /* eslint-disable new-cap */
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: app.server })],
  };
};

export { apolloConfig };
