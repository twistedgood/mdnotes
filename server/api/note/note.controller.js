'use strict';

var _ = require('lodash');
var ObjectId = require('mongoose').Types.ObjectId;
var Note = require('./note.model');


// Get list of notes
exports.index = function(req, res) {
  var params = {};
  if (req.query.user) {
    params.user = new ObjectId(req.query.user);
  } else {
    params.private = false;
  }
  Note.find(params, function (err, notes) {
    if(err) { return handleError(res, err); }
    return res.json(200, notes);
  });
};

// Get a single note
exports.show = function(req, res) {
  Note.findById(req.params.id, function (err, note) {
    if(err) { return handleError(res, err); }
    if(!note) { return res.send(404); }
    return res.json(note);
  });
};

// Creates a new note in the DB.
exports.create = function(req, res) {
  Note.create(req.body, function(err, note) {
    if(err) { return handleError(res, err); }
    return res.json(201, note);
  });
};

// Updates an existing note in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Note.findById(req.params.id, function (err, note) {
    if (err) { return handleError(res, err); }
    if(!note) { return res.send(404); }
    note.tags = [];
    var updated = _.merge(note, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, note);
    });
  });
};

// Deletes a note from the DB.
exports.destroy = function(req, res) {
  Note.findById(req.params.id, function (err, note) {
    if(err) { return handleError(res, err); }
    if(!note) { return res.send(404); }
    note.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.listTag = function(req, res) {
  Note.find().distinct('tags', function (err, tags) {
    if(err) { return handleError(res, err); }
    return res.json(tags);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
