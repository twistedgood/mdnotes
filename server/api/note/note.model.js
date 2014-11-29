'use strict';

var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  content: String,
  private: {
    type: Boolean,
    default: false
  },
  open: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  tags: []
});

NoteSchema.plugin(timestamps);

module.exports = mongoose.model('Note', NoteSchema);
