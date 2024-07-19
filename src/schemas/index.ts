import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../types";
import { resolvers } from "../resolvers/query";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
