'use strict';

describe('Controller: MyNoteCtrl', function () {

  // load the controller's module
  beforeEach(module('mdnotesApp'));
  beforeEach(module('socketMock'));

  var MyNoteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyNoteCtrl = $controller('MyNoteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
