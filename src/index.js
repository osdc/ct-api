
const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
import { graphqlSchema } from `./schema.js`;

mongoose
  .connect("mongodb://localhost/ct_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));

const app = express();

app.use(
  '/graphql',
  graphqlHTTP(async (request, response, graphQLParams) => {
    return {
      graphqlSchema,
      graphiql: true,
      context: {
        req: request,
      },
    };
  })
);

app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));

/*
export default {
  uri: `/events`,
  graphqlSchema,
  queries: [
    {
      title: '',
      query: ``,
    }
  ]
}
*/