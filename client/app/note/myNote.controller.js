'use strict';

angular.module('mdnotesApp')
  .controller('MyNoteCtrl', function ($scope, $controller) {
      $controller('NoteCtrl', {$scope: $scope});
  });
