'use strict';

angular.module('mdnotesApp')
  .factory('Note', function($resource) {
    return $resource('/api/notes/:id', {
      id: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'PUT'
      }
    });
  });
