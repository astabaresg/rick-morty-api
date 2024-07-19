import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../../utils/types";
import { resolvers } from "../resolvers/query";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
