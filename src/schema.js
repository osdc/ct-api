import { schemaComposer } from 'graphql-compose';
import { EventsTC } from './models/events';
import { TracksTC } from `./models/events`;

schemaComposer.Query.addFields({
  eventById: EventsTC.getResolver('findById'),
  eventByIds: EventsTC.getResolver('findByIds'),
  eventOne: EventsTC.getResolver('findOne'),
  eventMany: EventsTC.getResolver('findMany'),
  eventCount: EventsTC.getResolver('count'),
  eventConnection: EventsTC.getResolver('connection'),
  eventPagination: EventsTC.getResolver('pagination'),
});

schemaComposer.Mutation.addFields({
  eventCreateOne: EventsTC.getResolver('createOne'),
  eventCreateMany: EventsTC.getResolver('createMany'),
  eventUpdateById: EventsTC.getResolver('updateById'),
  eventUpdateOne: EventsTC.getResolver('updateOne'),
  eventUpdateMany: EventsTC.getResolver('updateMany'),
  eventRemoveById: EventsTC.getResolver('removeById'),
  eventRemoveOne: EventsTC.getResolver('removeOne'),  
  eventRemoveMany: EventsTC.getResolver('removeMany'),
});

schemaComposer.Query.addFields({
  trackById: TracksTC.getResolver('findById'),
  trackByIds: TracksTC.getResolver('findByIds'),
  trackOne: TracksTC.getResolver('findOne'),
  trackMany: TracksTC.getResolver('findMany'),
  trackCount: TracksTC.getResolver('count'),
  trackConnection: TracksTC.getResolver('connection'),
  trackPagination: TracksTC.getResolver('pagination'),
});

schemaComposer.Mutation.addFields({
  trackCreateOne: TracksTC.getResolver('createOne'),
  trackCreateMany: TracksTC.getResolver('createMany'),
  trackUpdateById: TracksTC.getResolver('updateById'),
  trackUpdateOne: TracksTC.getResolver('updateOne'),
  trackUpdateMany: TracksTC.getResolver('updateMany'),
  trackRemoveById: TracksTC.getResolver('removeById'),
  trackRemoveOne: TracksTC.getResolver('removeOne'),
  trackRemoveMany: TracksTC.getResolver('removeMany'),
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;
