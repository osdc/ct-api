const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const { graphqlSchema } = require("./schema.js");

mongoose
  .connect("mongodb://localhost:27017/ct_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
  })
);

app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
