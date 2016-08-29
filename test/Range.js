var expect = require('chai').expect;
var Range = require('../Range');

describe('Range', function() {
  var range = new Range(0, 10);

  describe('contains', function() {
    it('should return false for values below the range', function() {
      expect(range.contains(-1)).to.equal(false);
    });

    it('should return false for values above the range', function() {
      expect(range.contains(11)).to.equal(false);
    });

    it('should return true for values inside the range', function() {
      expect(range.contains(5)).to.equal(true);
    });

    it('should return true for values on the boundary', function() {
      expect(range.contains(0)).to.equal(true);
      expect(range.contains(10)).to.equal(true);
    });
  });
});
