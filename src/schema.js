const { schemaComposer } = require("graphql-compose");
const { EventsTC } = require("./models/events");
const { TracksTC } = require("./models/events");

// Here and in all other places of code variables suffix ...TC means that this is ObjectTypeComposer instance, ...ITC - InputTypeComposer, ...ETC - EnumTypeComposer.
// Add needed CRUD User operations to the GraphQL Schema
// via graphql-compose it will be much much easier, with less typing

schemaComposer.Query.addFields({
  eventById: EventsTC.getResolver("findById"),
  eventByIds: EventsTC.getResolver("findByIds"),
  eventOne: EventsTC.getResolver("findOne"),
  eventMany: EventsTC.getResolver("findMany"),
  eventCount: EventsTC.getResolver("count"),
  eventConnection: EventsTC.getResolver("connection"),
  eventPagination: EventsTC.getResolver("pagination")
});

schemaComposer.Mutation.addFields({
  eventCreateOne: EventsTC.getResolver("createOne"),
  eventCreateMany: EventsTC.getResolver("createMany"),
  eventUpdateById: EventsTC.getResolver("updateById"),
  eventUpdateOne: EventsTC.getResolver("updateOne"),
  eventUpdateMany: EventsTC.getResolver("updateMany"),
  eventRemoveById: EventsTC.getResolver("removeById"),
  eventRemoveOne: EventsTC.getResolver("removeOne"),
  eventRemoveMany: EventsTC.getResolver("removeMany")
});

schemaComposer.Query.addFields({
  trackById: TracksTC.getResolver("findById"),
  trackByIds: TracksTC.getResolver("findByIds"),
  trackOne: TracksTC.getResolver("findOne"),
  trackMany: TracksTC.getResolver("findMany"),
  trackCount: TracksTC.getResolver("count"),
  trackConnection: TracksTC.getResolver("connection"),
  trackPagination: TracksTC.getResolver("pagination")
});

schemaComposer.Mutation.addFields({
  trackCreateOne: TracksTC.getResolver("createOne"),
  trackCreateMany: TracksTC.getResolver("createMany"),
  trackUpdateById: TracksTC.getResolver("updateById"),
  trackUpdateOne: TracksTC.getResolver("updateOne"),
  trackUpdateMany: TracksTC.getResolver("updateMany"),
  trackRemoveById: TracksTC.getResolver("removeById"),
  trackRemoveOne: TracksTC.getResolver("removeOne"),
  trackRemoveMany: TracksTC.getResolver("removeMany")
});

exports.graphqlSchema = schemaComposer.buildSchema();

// export default graphqlSchema;
