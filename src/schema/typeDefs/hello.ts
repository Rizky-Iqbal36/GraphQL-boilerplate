import { gql } from "apollo-server-fastify";

module.exports.typeDef = gql`
  type Query {
    helloWorld: String!
  }
`;
