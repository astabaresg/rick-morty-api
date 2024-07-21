import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Location {
    id: ID!
    name: String!
    type: String
    dimension: String
  }
  type Character {
    id: ID!
    name: String!
    status: String
    species: String
    gender: String
    origin: Location
    location: Location
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
