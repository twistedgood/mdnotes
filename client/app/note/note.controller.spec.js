'use strict';

describe('Controller: NoteCtrl', function () {

  // load the controller's module
  beforeEach(module('mdnotesApp'));
  beforeEach(module('socketMock'));

  var NoteCtrl, scope, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    NoteCtrl = $controller('NoteCtrl', {
      $scope: scope,
      $stateParams: {id: 'XXX'}
    });
  }));

  it('should find all notes', function () {
    $httpBackend.expectGET('/api/notes').respond([
      {title: 'A', content: 'aaa' },
      {title: 'B', content: 'bbb' }
    ]);
    scope.find();
    $httpBackend.flush();
    expect(scope.notes.length).toEqual(2);
  });

  it('should find one note', function () {
    $httpBackend.expectGET('/api/notes/XXX').respond(
      {title: 'A', content: 'aaa' }
    );
    scope.findOne();
    $httpBackend.flush();
    expect(scope.note.title).toEqual('A');
  });

});
