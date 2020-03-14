require('./mongoose-moment')(mongoose);
import mongoose from 'mongoose';

const TracksSchema = new mongoose.Schema({
  name: [{type: String, required = true}],
  description: String,
  start_time: Moment,
  resources: [{
    type: String,
    unique: true,
  },],
  duration: Moment,
  speakers_gh_handle: [String],
}) 

export const EventsSchema = new mongoose.Schema({
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
  tracks: {
      type: [TracksSchema],
  },
  location: String,
})

export const Events = model('Events', EventsSchema);
export const Tracks = model(`Tracks`, TracksSchema);

export const EventsTC = composeWithMongoose(Events);
export const TracksTC = composeWithMongoose(Tracks)