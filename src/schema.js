const { schemaComposer } = require("graphql-compose");

const { EventsTC, Events } = require("./models/events");
const { TracksTC } = require("./models/events");

// Here and in all other places of code variables suffix ...TC means that this is ObjectTypeComposer instance, ...ITC - InputTypeComposer, ...ETC - EnumTypeComposer.
// Add needed CRUD User operations to the GraphQL Schema
// via graphql-compose it will be much much easier, with less typing

const ghop = require("./ghop");
const ghopslides = require("./ghop");

require("dotenv").config();

const {PubSub} = require("apollo-server-express")

const pubsub = new PubSub();

const NEW_MEETUP = 'NEW_MEETUP_ADDED';

schemaComposer.Subscription.addFields({
  eventAdded: {
    type: EventsTC,
    resolve: (_id) => Events.findById(_id),
    subscribe: () => pubsub.asyncIterator([NEW_MEETUP]),
  }
})

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
  eventCreateOne: EventsTC.getResolver("createOne", [
    async (next, s, a, c, i) => {
      const res = await next(s, a, c, i);
      const _id = res?.record?._id;
      if (_id) pubsub.publish(NEW_MEETUP, _id);
      return res;
    },
  ]).wrapResolve(next => rp => {
    console.log(rp.args.record);
    let meetupData = {
      date: rp.args.record.event_start_time.toDateString(),
      topic: rp.args.record.name,
      details: rp.args.record.description,
      speaker: rp.args.record.speaker
        ? rp.args.record.speaker
        : "OSDC Core Team"
    };
    let token = process.env.GITHUB_TOKEN;
    ghop(meetupData, token);
    return next(rp);
  }),
  eventCreateMany: EventsTC.getResolver("createMany"),
  eventUpdateById: EventsTC.getResolver("updateById").wrapResolve(
    next => rp => {
      if (rp.args.record.tracks[0].resources[0]) {
        let token = process.env.GITHUB_TOKEN;
        ghopslides(rp.args.record.tracks[0].resources[0], token);
      }
      return next(rp);
    }
  ),
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
