var expect = require('chai').expect;
var Range = require('../Range');
var RangeSet = require('../RangeSet');

describe('RangeSet', function() {
  var set;
  beforeEach(function() {
    set = new RangeSet();
  });

  describe('add', function() {
    it('should properly add a new range under the appropriate key', function() {
      var range = new Range(0, 10);
      set.add(range, 2);

      expect(set.ranges[2]).to.not.equal(undefined);
    });
  });

  describe('contains', function() {
    it('should return false if the range set does not contain any entry for that y coordinate', function() {
      expect(set.contains(1, 2)).to.equal(false);
    });

    it('should return false if the range set has an entry for that y, but it does not contain that number', function() {
      set.add(new Range(0, 1), 2);
      expect(set.contains(2, 2)).to.equal(false);
    });

    it('should return true if the cell is contained in the set', function() {
      set.add(new Range(0, 1), 2);
      expect(set.contains(2, 1)).to.equal(true);
    });
  });

  describe('boundaries', function() {
    it('should return a cell set of boundaries', function() {
      set.add(new Range(0, 1), 2);
      set.add(new Range(1, 2), 1);
      var cells = set.boundaries().cells;
      expect(cells.length).to.equal(4);
    });
  });

  describe('toPathString', function() {
    it('should return a valid SVG path string matching the provided set', function() {
      set.add(new Range(1, 10), 2);
      set.add(new Range(2, 5), 3);
      var path = set.toPathString();
      expect(path).to.equal('M0,0 M2,1 L2,10 M3,2 L3,5');
    });
  });

  describe('last', function() {
    it('should return null if the set is empty', function() {
      expect(set.last).to.equal(null);
    });

    it('should return the last element set', function() {
      set.add(new Range(1, 10), 2);

      expect(set.last).to.not.equal(null);
      expect(set.last.x).to.equal(2);
      expect(set.last.range.min).to.equal(1);
      expect(set.last.range.max).to.equal(10);
    });

    it('should update if a new element is added', function() {
      set.add(new Range(3, 8), 1);
      set.add(new Range(1, 10), 2);

      expect(set.last).to.not.equal(null);
      expect(set.last.x).to.equal(2);
      expect(set.last.range.min).to.equal(1);
      expect(set.last.range.max).to.equal(10);
    });

    it('should not be settable', function() {
      set.last = 'NOT SETTABLE';
      expect(set.last).to.equal(null);
    });
  });
});
