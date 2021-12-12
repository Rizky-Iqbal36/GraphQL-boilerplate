import GraphQLServerOptions from "apollo-server-core/dist/graphqlOptions";
import {
  ApolloServer,
  ApolloServerFastifyConfig as ApolloConfig,
} from "apollo-server-fastify";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { GraphQLContext } from "@root/interfaces";
import { FastifyRequest, FastifyReply } from "fastify";

export type FormatError = (
  graphQLError: GraphQLError,
  context: GraphQLContext
) => GraphQLFormattedError;

export type ApolloServerFastifyConfig = Omit<ApolloConfig, "formatError"> & {
  formatError?: FormatError;
};

/**
 * A modified instance of apollo fastify server class
 * that calls formatError() method with the custom context value.
 */
export class CustomApolloServer extends ApolloServer {
  constructor(config: ApolloServerFastifyConfig) {
    super(config as ApolloConfig);
  }

  async createGraphQLServerOptions(
    req: FastifyRequest,
    rep: FastifyReply
  ): Promise<GraphQLServerOptions> {
    const options = await super.createGraphQLServerOptions(req, rep);

    if (typeof options.formatError === "function") {
      const formatError = options.formatError as FormatError;
      const context = options.context as GraphQLContext;

      options.formatError = (graphQLError: GraphQLError) => {
        return formatError(graphQLError, context);
      };
    }

    return options;
  }
}
