'use strict';

angular.module('mdnotesApp')
  .controller('NoteCtrl', function ($scope, $stateParams, $location, Auth, socket, Note) {

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('note');
    });

    $scope.find = function() {
      var params = {};
      if ($location.path() == '/note/my') {
        var user = Auth.getCurrentUser();
        if (user) {
          params.user = user._id
        }
      }
      $scope.notes = Note.query(params);
      socket.syncUpdates('note', $scope.notes);
    };

    $scope.findOne = function() {
      $scope.note = Note.get({id: $stateParams.id});
    };

    $scope.newOne = function() {
      $scope.note = new Note({
        user: Auth.getCurrentUser()._id
      }); 
    };

    $scope.save = function() {
      var note = $scope.note;
      if (note._id) {
        note.$update(function(response) {
          $location.path('note/' + response._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      } else {
        note.$save(function(response) {
          $location.path('note/' + response._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    $scope.remove = function(note) {
      note.$remove(function(response) {
        $location.path('note');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


  });
