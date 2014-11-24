'use strict';

describe('Service: note', function () {

  // load the service's module
  beforeEach(module('mdnotesApp'));
  beforeEach(module('socketMock'));

  // instantiate service
  var Note;
  var $httpBackend;
  beforeEach(inject(function (_$httpBackend_, _Note_) {
    Note = _Note_;
    $httpBackend = _$httpBackend_;
  }));

  it('should do something', function () {
    expect(!!Note).toEqual(true);
  });

  it('should find all notes', function () {
    $httpBackend.expectGET('/api/notes').respond([
      {title: 'A', content: 'aaa' },
      {title: 'B', content: 'bbb' }
    ]);
    var notes = Note.query();
    $httpBackend.flush();
    expect(notes.length).toEqual(2);
  });

  it('should find one note', function () {
    $httpBackend.expectGET('/api/notes/XXX').respond(
      {title: 'A', content: 'aaa' }
    );
    var note = Note.get({id: 'XXX'});
    $httpBackend.flush();
    expect(note.title).toEqual('A');
  });

});
