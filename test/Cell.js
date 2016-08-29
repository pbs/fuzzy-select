var expect = require('chai').expect;
var Cell = require('../Cell.js');

describe('Cell', function() {
  describe('equals', function() {
    it('should return true for two cells that are equal', function() {
      var c1 = new Cell({ x: 1, y: 2 });
      var c2 = new Cell({ x: 1, y: 2 });

      expect(c1.equals(c2)).to.equal(true);
      expect(c2.equals(c1)).to.equal(true);
    });

    it('should return false for two cells that are different', function() {
      var c1 = new Cell({ x: 1, y: 2 });
      var c2 = new Cell({ x: 2, y: 2 });
      var c3 = new Cell({ x: 1, y: 1 });

      expect(c1.equals(c2)).to.equal(false);
      expect(c1.equals(c3)).to.equal(false);
    });
  });

  describe('fromId', function() {
    it('should properly decode a cell', function() {
      var c = new Cell({ x: 100, y : 200 });
      var decoded = Cell.fromId(c.id);
      expect(c.x).to.equal(100);
      expect(c.y).to.equal(200);
    });

    it('should handle negatives properly', function() {
      this.timeout(500);
      for(var i = 0; i < 65535; i++) {
        var cell = new Cell({ x: i, y: 0 });
        expect(Cell.fromId(cell.id).x).to.equal(i);
      }
    });
  });

  describe('areCollinear', function() {
    it('should return true if the three points are collinear', function() {
      var c1 = new Cell({ x: 0, y: 0 });
      var c2 = new Cell({ x: 1, y: 1 });
      var c3 = new Cell({ x: 3, y: 3 });

      expect(Cell.areCollinear(c1, c2, c3)).to.equal(true);
    });

    it('should return false if the points are not collinear', function() {
      var c1 = new Cell({ x: 0, y: 0 });
      var c2 = new Cell({ x: 1, y: 1 });
      var c3 = new Cell({ x: 5, y: 3 });
      
      expect(Cell.areCollinear(c1, c2, c3)).to.equal(false);
    });
  });
  
  describe('move', function() {
    it('should properly use deltas', function() {
      var c = new Cell({ x: 1, y: 1 });
      expect(c.move('NORTH').id).to.equal(Cell.hash(1, 0));
      expect(c.move('SOUTH').id).to.equal(Cell.hash(1, 2));
      expect(c.move('EAST').id).to.equal(Cell.hash(2, 1));
      expect(c.move('WEST').id).to.equal(Cell.hash(0, 1));
    });
  });
});
