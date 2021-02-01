const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } =require('apollo-server-express');
const mongoose = require("mongoose");
const { execute, subscribe }= require('graphql');
const { createServer }= require('http');
const { SubscriptionServer }= require('subscriptions-transport-ws');
const { graphqlSchema } = require("./schema.js");

mongoose
  .connect("mongodb://localhost:27017/ct_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));

const PORT = 4000;
const app = express();

app.use('/graphql', bodyParser.json());

const apolloServer = new ApolloServer({ schema: graphqlSchema, playground: {
  subscriptionEndpoint: `ws://localhost:${PORT}/subscriptions`
} });
apolloServer.applyMiddleware({ app });

const server = createServer(app);

server.listen(PORT, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema: graphqlSchema,
    }, {
      server: server,
      path: '/subscriptions',
    });
});

//A sample mutation:

// mutation {
//   eventCreateOne( record : {
//   	name: "Open Source for cats",
//     description: "Open source workshops for felines among us.",
//     dateCreated: "2020-03-27",
//     dateUpdated: "2020-03-27",
//     location: "Behind OAT"
//   	}
//   ) {
//     recordId
//     record {
//       name
//       description
//       dateCreated
//       dateUpdated
//       location
//     }
//   }
// }
