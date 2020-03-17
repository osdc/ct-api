const mongoose = require("mongoose");
const { model } = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");

// Define Mongoose Schema for Tracks
const TracksSchema = new mongoose.Schema({
  name: [{ type: String, required: true }],
  description: String,
  start_time: "Date",
  resources: [
    {
      type: String,
      unique: true
    }
  ],
  duration: "Date",
  speakers_gh_handle: [String]
});

// Define Mongoose Schema for Events
const EventsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  dateCreated: {
    type: "Date",
    required: true
  },
  dateUpdated: {
    type: "Date",
    required: true
  },
  event_start_time: "Date",
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "finished"],
    default: "scheduled"
  },
  eventLinks: { type: String, unique: true },
  visibility: Boolean,
  yes_rsvp_count: Number,
  type: {
    type: String,
    enum: ["Informal", "Workshop", "Talk"]
  },
  tracks: {
    type: [TracksSchema] // You may include other schemas (here included as array of embedded documents)
  },
  location: String
});

// Define Mongoose Model for Schema
const Events = model("Events", EventsSchema);
// Define Mongoose Model for Tracks
const Tracks = model("Tracks", TracksSchema);

// Convert Mongoose Model to GraphQL Pieces.
// This is a `ObjectTypeComposer` instance for Events. `ObjectTypeComposer` has `GraphQLObjectType` inside, avaliable via method EventsTC.getType().
exports.EventsTC = composeWithMongoose(Events, {});
// This is a `ObjectTypeComposer` instance for Tracks. `ObjectTypeComposer` has `GraphQLObjectType` inside, avaliable via method TracksTC.getType().
exports.TracksTC = composeWithMongoose(Tracks, {});
