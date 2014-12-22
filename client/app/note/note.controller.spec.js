'use strict';

describe('Controller: NoteCtrl', function () {

  // load the controller's module
  beforeEach(module('mdnotesApp'));
  beforeEach(module('socketMock'));

  var NoteCtrl, scope, $state, Note, Auth, socket, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$state_, _$httpBackend_, _Auth_, _Note_, _socket_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    NoteCtrl = $controller('NoteCtrl', {
      $scope: scope,
      $state: $state = _$state_,
      $stateParams: {id: 'XXX'},
      socket: socket = _socket_,
      Auth: Auth = _Auth_,
      Note: Note = _Note_
    });
  }));

  describe('find', function () {
    it('should find all notes', function () {
      spyOn(socket, 'syncUpdates').andCallThrough();
      $state.current.name = 'listNote';
      spyOn(Note, 'query').andReturn([
        {title: 'A', content: 'aaa' },
        {title: 'B', content: 'bbb' }
      ]);
      scope.find();
      expect(scope.notes.length).toEqual(2);
      expect(socket.syncUpdates).toHaveBeenCalledWith('note', scope.notes);
    });

    it('should find my notes', function () {
      $state.current.name = 'listMyNote';
      spyOn(Note, 'query').andReturn([
        {title: 'A', content: 'aaa' }
      ]);
      spyOn(Auth, 'getCurrentUser').andReturn(
        {_id: 'XX_USER'}
      );
      scope.find();
      expect(Note.query).toHaveBeenCalledWith({user: 'XX_USER'});
      expect(scope.notes.length).toEqual(1);
    });

    it('should find all notes if not authenticated', function () {
      $state.current.name = 'listMyNote';
      spyOn(Note, 'query').andReturn([
        {title: 'A', content: 'aaa' },
        {title: 'B', content: 'bbb' }
      ]);
      spyOn(Auth, 'getCurrentUser').andReturn(null);
      scope.find();
      expect(Note.query).toHaveBeenCalledWith({});
      expect(scope.notes.length).toEqual(2);
    });
  });
  
  describe('findOne', function () {
    it('should find one note', function () {
      spyOn(Note, 'get').andReturn(
        {title: 'A', content: 'aaa'}
      );
      scope.findOne();
      expect(Note.get).toHaveBeenCalledWith({id :'XXX'});
      expect(scope.note.title).toEqual('A');
    });
  });

  describe('newOne', function () {
    it('should create one a note', function () {
      expect(scope.note).toBeUndefined();
      scope.newOne();
      expect(scope.note).toBeDefined();
    });
  });

  describe('save()', function () {
    it('should save the note', function () {
      var note = new Note();
      spyOn(note, '$save').andCallFake(function(success, error) {
        success({_id: 'NEW_ID'});
      });
      spyOn($state, 'go').andCallThrough();
      scope.note = note;
      scope.save();
      expect(note.$save).toHaveBeenCalled();
      expect($state.go).toHaveBeenCalledWith('viewNote', {id: 'NEW_ID'});
    });

    it('should retrieve the error message if failed to save', function () {
      var note = new Note();
      spyOn(note, '$save').andCallFake(function(success, error) {
        error({ data: { message: 'ERROR!!' } });
      });
      scope.note = note;
      scope.save();
      expect(note.$save).toHaveBeenCalled();
      expect(scope.error).toEqual('ERROR!!');
    });
  });

  describe('update()', function () {
    it('should update the note', function () {
      var note = new Note({_id: 'XX_ID'});
      spyOn(note, '$update').andCallFake(function(success, error) {
        success({_id: 'XX_ID'});
      });
      spyOn($state, 'go').andCallThrough();
      scope.note = note;
      scope.save();
      expect(note.$update).toHaveBeenCalled();
      expect($state.go).toHaveBeenCalledWith('viewNote', {id: 'XX_ID'});
    });

    it('should retrieve the error message if failed to update', function () {
      var note = new Note({_id: 'XX_ID'});
      spyOn(note, '$update').andCallFake(function(success, error) {
        error({ data: { message: 'ERROR!!' } });
      });
      scope.note = note;
      scope.save();
      expect(note.$update).toHaveBeenCalled();
      expect(scope.error).toEqual('ERROR!!');
    });
  });

  describe('remove(note)', function () {
    it('should remove one note', function () {
      var note = new Note({_id: 'XX_ID'});
      spyOn(note, '$remove').andCallFake(function(success, error) {
        success();
      });
      spyOn($state, 'reload').andCallFake(function() {});
      scope.remove(note);
      expect(note.$remove).toHaveBeenCalled();
      expect($state.reload).toHaveBeenCalled();
    });

    it('should retrieve the error message if failed to remove', function () {
      var note = new Note({_id: 'XX_ID'});
      spyOn(note, '$remove').andCallFake(function(success, error) {
        error({ data: { message: 'ERROR!!' } });
      });
      scope.remove(note);
      expect(note.$remove).toHaveBeenCalled();
      expect(scope.error).toEqual('ERROR!!');
    });
  });

  describe('isEditable(note)', function () {
    it('should return true if not logged in', function () {
      var note = new Note({
        _id: 'XX_ID',
        user: 'XX_USER'
      });
      spyOn(Auth, 'isLoggedIn').andReturn(false);
      expect(scope.isEditable(note)).toBe(false);
    });

    it('should return true if my note', function () {
      var note = new Note({
        _id: 'XX_ID',
        user: 'XX_USER'
      });
      spyOn(Auth, 'isLoggedIn').andReturn(true);
      spyOn(Auth, 'getCurrentUser').andReturn({_id: 'XX_USER'});
      expect(scope.isEditable(note)).toBe(true);
    });

    it('should return true if someone\'s opened note', function () {
      var note = new Note({
        _id: 'XX_ID',
        user: 'XX_SOMEONE',
        open: true
      });
      spyOn(Auth, 'isLoggedIn').andReturn(true);
      spyOn(Auth, 'getCurrentUser').andReturn({_id: 'XX_USER'});
      expect(scope.isEditable(note)).toBe(true);
    });

    it('should return true if someone\'s closed note', function () {
      var note = new Note({
        _id: 'XX_ID',
        user: 'XX_SOMEONE',
        open: false
      });
      spyOn(Auth, 'isLoggedIn').andReturn(true);
      spyOn(Auth, 'getCurrentUser').andReturn({_id: 'XX_USER'});
      expect(scope.isEditable(note)).toBe(false);
    });
  });

  describe('$scope.$on(\'destory\')', function () {
    it('should call unsyncUpdate on destroy', function () {
      spyOn(socket, 'unsyncUpdates').andCallThrough();
      scope.$destroy();
      expect(socket.unsyncUpdates).toHaveBeenCalledWith('note');
    });
  });

});
