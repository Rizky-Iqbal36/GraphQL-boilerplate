import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServerFastifyConfig } from "apollo-server-fastify";
import { FastifyInstance, FastifyReply } from "fastify";

import { typeDefs, resolvers } from "@root/schema";
import { IFastifyRequest } from "@root/interfaces";
interface ISession {
  request: IFastifyRequest;
  reply: FastifyReply;
  [key: string]: any;
}

const apolloConfig = (app: FastifyInstance): ApolloServerFastifyConfig => {
  return {
    typeDefs,
    resolvers,
    context: async ({ request, reply }: ISession) => {
      throw new Error("uwauwuw");
    },
    /* eslint-disable new-cap */
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: app.server })],
  };
};

export { apolloConfig };
