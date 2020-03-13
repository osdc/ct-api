import mongoose from 'mongoose';
require('mongoose-moment')(mongoose);
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
import { dedentBlockStringValue } from 'graphql/language/blockString';

//1->Defining Mongoose Schema and Models

const EventsSchema = new mongoose.Schema({
  name: {type: String, required = true},
  description: String,
  dateCreated: { 
    type: Moment, 
    required: true,
  },
  dateUpdated: { 
    type: Moment, 
    required: true,
  },
  event_start_time: Moment,
  event_end_time: Moment, //TODO: To be caulcated from summing all durations in tracksschema adn then adding it to event_start_time. May need Moment JS as a helper module
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'finished'],
    default: 'scheduled'
  },
  eventLinks: {type: String, unique = true},
  visibility: Boolean,
  yes_rsvp_count: Number,
  type: {
    type: String,
    enum: ['Informal', 'Workshop', 'Talk']
  },
  location: String,
  //Link to TracksSchema. Events -> Tracks :: One to Many
  
})

const TracksSchema = new mongoose.Schema({
  name: [{type: String, required = true}],
  description: String,
  start_time: Moment,
  resources: [{
    type: String,
    unique: true,
  },],
  duration: Moment, //TODO: Implement duration resolver/plugin
  events: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'EventsSchema',
    required: true,
  },
  speakers: [{
    type: mongoose.SchemaTypes.ObjectID,
    ref: 'SpeakersSchema'
  }],
  //Link to Speakers Schema. Tracks -> Speakers :: Many to Many 
}) 

const SpeakersSchema = new mongoose.Schema({
  name: String,
  social_links: [{
    type: String,
    unique: true
  },],
  
  //Link to TracksSchema. Speakers -> :: Many to Many 
})



const Events = mongoose.model('Events', EventsSchema);
const Tracks = mongoose.model('Tracks', TracksSchema);
const Speakers = mongoose.model('Speakers', SpeakersSchema);


/*EventsTC.addFields({
  tracks: {
    type: [TracksTC], //Array of tracks
    resolve: (events, args, context, info) => {
      return db.Posts.find({ eventID: events.id });
    },
  },
})*/

//2->Converting Mongoose Model to GraphQL Pieces
const customizationOptions = {};
const EventsTC = composeWithMongoose(Events, customizationOptions);
const TracksTC = composeWithMongoose(Tracks, customizationOptions);
const SpeakersTC = composeWithMongoose(Speakers, customizationOptions);

//->CRUD operatiosn to Schemas

//TODO: Add custom resolvers in schemas

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

schemaComposer.Query.addFields({
  speakerById: SpeakersTC.getResolver('findById'),
  speakerByIds: SpeakersTC.getResolver('findByIds'),
  speakerOne: SpeakersTC.getResolver('findOne'),
  speakerMany: SpeakersTC.getResolver('findMany'),
  speakerCount: SpeakersTC.getResolver('count'),
  speakerConnection: SpeakersTC.getResolver('connection'),
  speakerPagination: SpeakersTC.getResolver('pagination'),
});

schemaComposer.Mutation.addFields({
  speakerCreateOne: SpeakersTC.getResolver('createOne'),
  speakerCreateMany: SpeakersTC.getResolver('createMany'),
  speakerUpdateById: SpeakersTC.getResolver('updateById'),
  speakerUpdateOne: SpeakersTC.getResolver('updateOne'),
  speakerUpdateMany: SpeakersTC.getResolver('updateMany'),
  speakerRemoveById: SpeakersTC.getResolver('removeById'),
  speakerRemoveOne: SpeakersTC.getResolver('removeOne'),
  speakerRemoveMany: SpeakersTC.getResolver('removeMany'),
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;

//TODO: To modularize the code
//TODO: Implement Mongoose server ENV details and setup proper project tooling
//TODO: Implement pre save hooks