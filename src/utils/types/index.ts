import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Character {
    id: ID!
    name: String!
    status: String
    species: String
    gender: String
    origin: String
  }

  type Query {
    characters(
      status: String
      species: String
      gender: String
      name: String
      origin: String
    ): [Character]
  }
`;
