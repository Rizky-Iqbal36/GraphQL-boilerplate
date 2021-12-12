import { gql } from "apollo-server-fastify";

module.exports.typeDef = gql`
  type Mutation {
    exampleMutation(exampleArg: String!): String!
  }

  type Query {
    exampleQuery: String!
  }
`;
