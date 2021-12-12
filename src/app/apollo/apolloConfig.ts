import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { FastifyInstance, FastifyReply } from "fastify";
import { applyMiddleware } from "graphql-middleware";

import { typeDefs, resolvers } from "@root/schema";
import { IFastifyRequest } from "@root/interfaces";

import MiddlewareHandler from "@app/middlewares";
import { ApolloServerFastifyConfig } from "@app/apollo";
import { formatError } from "@app/apollo/formatError";
interface ISession {
  request: IFastifyRequest;
  reply: FastifyReply;
  [key: string]: any;
}

const apolloConfig = (app: FastifyInstance): ApolloServerFastifyConfig => {
  MiddlewareHandler.registerMiddleware();
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const schemaWithMiddleware = applyMiddleware(
    schema,
    ...MiddlewareHandler.getMiddlewares()
  );

  return {
    schema: schemaWithMiddleware,
    context: async ({ request, reply }: ISession) => {
      return MiddlewareHandler.context(request, reply);
    },
    /* eslint-disable new-cap */
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: app.server })],
    formatError,
  };
};

export { apolloConfig };
