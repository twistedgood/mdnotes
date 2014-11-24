'use strict';

describe('Service: note', function () {

  // load the service's module
  beforeEach(module('mdnotesApp'));
  beforeEach(module('socketMock'));

  // instantiate service
  var Note;
  beforeEach(inject(function (_Note_) {
    Note = _Note_;
  }));

  it('should do something', function () {
    expect(!!Note).toBe(true);
  });

});
