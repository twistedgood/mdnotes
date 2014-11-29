'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Note = require('../note/note.model');

describe('GET /api/notes', function() {
  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

describe('POST /api/notes', function() {
  it('should register', function(done) {
    request(app)
      .post('/api/notes')
      .send({
        title: 'Test Title',
        content: 'Test Content',
        tags: [
          {text: 'Test Tag A'},
          {text: 'Test Tag B'}
        ]
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body._id.should.match(/[0-9a-f]{24}/);
        res.body.title.should.equal('Test Title');
        res.body.tags.should.have.length(2);
        res.body.tags[0].text.should.equal('Test Tag A');
        res.body.tags[1].text.should.equal('Test Tag B');
        done();
      });
  });
});

describe('POST /api/notes', function() {
  var note = new Note({
    title: 'Test Title',
    content: 'Test Content',
    tags: [
      {text: 'Test Tag A'},
      {text: 'Test Tag B'}
    ]
  });

  before(function(done) {
    Note.remove().exec()
    .then(function() {
      return Note.create(note)
    })
    .then(function() {
      done();
    })
  });

  it('should register', function(done) {
    request(app)
      .put('/api/notes/' + note._id)
      .send({
        _id: note._id,
        title: 'Test Title',
        content: 'Test Content',
        tags: [
          {text: 'Test Tag C'},
        ]
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body._id.should.match(/[0-9a-f]{24}/);
        res.body.title.should.equal('Test Title');
        res.body.tags.should.have.length(1);
        res.body.tags[0].text.should.equal('Test Tag C');
        done();
      });
  });
});

describe('GET /api/notes/tag', function() {
  before(function(done) {
    Note.remove().exec()
    .then(function() {
      return Note.create([{
        title: 'Title A',
        tags: [
          {'text': 'Tag A'},
          {'text': 'Tag B'}
        ] 
      }, {
        title: 'Title B',
        tags: [
          {'text': 'Tag B'},
          {'text': 'Tag C'}
        ] 
      }])
    })
    .then(function() {
      done();
    })
  });

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/notes/tags')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.should.have.length(3);
        res.body[0].text.should.equal('Tag A');
        res.body[1].text.should.equal('Tag B');
        res.body[2].text.should.equal('Tag C');
        done();
      });
  });
});
