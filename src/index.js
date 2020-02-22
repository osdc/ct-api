const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = new Schema({
  Name: String
});
mongoose.connect("mongodb://localhost:27017/ct_api");
const Event = mongoose.model("Event", EventSchema);

const schema = buildSchema(`
  input EventInput{
    Name : String
  }
  type Query {
    hello: String
    nextevent : [String]
  }
  type Mutation {
    addevent(eventinput : EventInput) : String
  }
`);

const root = {
  hello: () => "Hello world!",
  addevent: arg => {
    const event = new Event({
      Name: arg.eventinput.Name
    });
    event.save();
  },
  nextevent: () => {
    return Event.find().then(events => {
      return events.map(event => {
        return event.Name;
      });
    });
  }
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
