const mongoose = require("mongoose");
const { model } = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");

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
    type: [TracksSchema]
  },
  location: String
});

const Events = model("Events", EventsSchema);
const Tracks = model(`Tracks`, TracksSchema);

exports.EventsTC = composeWithMongoose(Events, {});
exports.TracksTC = composeWithMongoose(Tracks);
