'use strict';

describe('Controller: NoteCtrl', function () {

  // load the controller's module
  beforeEach(module('mdnotesApp'));
  beforeEach(module('socketMock'));

  var NoteCtrl, scope, Note, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    Note = function(properties){
      for (var k in properties) {
        this[k] = properties[k];
      }
    };
    Note.query = function() {
        return [
          {title: 'A', content: 'aaa' },
          {title: 'B', content: 'bbb' }
        ];
    };
    Note.get = function() {
      return {title: 'A', content: 'aaa' };
    };
    NoteCtrl = $controller('NoteCtrl', {
      $scope: scope,
      $stateParams: {id: 'XXX'},
      Note: Note
    });
  }));

  it('should find all notes', function () {
    spyOn(Note, 'query').andCallThrough();
    scope.find();
    expect(Note.query).toHaveBeenCalled();
    expect(scope.notes.length).toEqual(2);
  });

  it('should find one note', function () {
    spyOn(Note, 'get').andCallThrough();
    scope.findOne();
    expect(Note.get).toHaveBeenCalledWith({id :'XXX'});
    expect(scope.note.title).toEqual('A');
  });

  it('should create one new note', function () {
    expect(scope.note).toBeUndefined();
    scope.newOne();
    expect(scope.note).toBeDefined();
  });

});
