'use strict';

angular.module('mdnotesApp')
  .controller('NoteCtrl', function ($scope, $state, $stateParams, Auth, socket, Note) {

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('note');
    });

    $scope.find = function() {
      var params = {};
      if ($state.current.name === 'listMyNote') {
        var user = Auth.getCurrentUser();
        if (user) {
          params.user = user._id;
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
          $state.go('viewNote', {id: response._id});
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      } else {
        note.$save(function(response) {
          $state.go('viewNote', {id: response._id});
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    $scope.remove = function(note) {
      note.$remove(function(response) {
        $state.reload();
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.isEditable = function(note) {
      if (Auth.isLoggedIn()) {
        var user = Auth.getCurrentUser();
        if (user._id === note.user) {
          return true;
        }
        return note.open;
      }
      return false;
    };

  });
