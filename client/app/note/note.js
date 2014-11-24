'use strict';

angular.module('mdnotesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('listNote', {
        url: '/note',
        templateUrl: 'app/note/notes.html',
        controller: 'NoteCtrl'
      })
      .state('listMyNote', {
        url: '/note/my',
        templateUrl: 'app/note/mynotes.html',
        controller: 'MyNoteCtrl'
      })
      .state('createNote', {
        url: '/note/create',
        templateUrl: 'app/note/create.html',
        controller: 'NoteCtrl'
      })
      .state('viewNote', {
        url: '/note/:id',
        templateUrl: 'app/note/view.html',
        controller: 'NoteCtrl'
      })
      .state('editNote', {
        url: '/note/edit/:id',
        templateUrl: 'app/note/edit.html',
        controller: 'NoteCtrl'
      });
  });
