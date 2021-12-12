import { GraphQLContext } from "@root/interfaces";

const authenticationMiddleware = async (
  resolve: any,
  root: any,
  args: any,
  context: GraphQLContext,
  info: any
) => {
  // Authentication logic
  const result = await resolve(root, args, context, info);
  return result;
};

module.exports.localMiddleware = {
  middleWareFunc: authenticationMiddleware,
  exclude: true,
  // List of resolvers that does not need authentication
  resolver: [],
};
