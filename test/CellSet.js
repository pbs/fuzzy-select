var expect = require('chai').expect;
var CellSet = require('../CellSet');
var Cell = require('../Cell');

describe('CellSet', function() {
  var cellSet;

  beforeEach(function() {
    cellSet = new CellSet();
  });

  describe('contains', function() {
    it('should return false if the element is not in the set', function() {
      expect(cellSet.contains(new Cell({ x: 1, y: 1 }))).to.equal(false);
    });

    it('should return true if the element is in the set', function() {
      var c1 = new Cell({ x: 1, y: 1 });
      var c2 = new Cell({ x: 2, y: 1 });
      var c3 = new Cell({ x: 3, y: 1 });
      cellSet.add(c1);
      cellSet.add(c2);
      cellSet.add(c3);

      expect(cellSet.contains(c1)).to.equal(true);
      expect(cellSet.contains(c2)).to.equal(true);
      expect(cellSet.contains(c3)).to.equal(true);
    });
  });

  describe('add', function() {
    it('should add a cell if its not yet in the cellSet', function() {
      expect(cellSet.cells.length).to.equal(0);
      cellSet.add(new Cell({ x: 1, y: 1 }));
      expect(cellSet.cells.length).to.equal(1);
    });
    
    it('should not add a cell if its already in the cellSet', function() {
      cellSet.add(new Cell({ x: 1, y: 1 }));
      expect(cellSet.cells.length).to.equal(1);
      cellSet.add(new Cell({ x: 1, y: 1 }));
      expect(cellSet.cells.length).to.equal(1);
    });

    it('should not mess up the existing chain order', function() {
      cellSet.add(new Cell({ x: 1, y: 1 }));
      expect(cellSet.cells.length).to.equal(1);
      cellSet.add(new Cell({ x: 1, y: 2 }));
      expect(cellSet.cells.length).to.equal(2);
      cellSet.add(new Cell({ x: 1, y: 1 }));
      expect(cellSet.cells.length).to.equal(2);
    });
  });

  describe('containsXY', function() {
    it('should return true if the (x,y) is in the set', function() {
      cellSet.add(new Cell({ x: 1, y: 2 }));
      expect(cellSet.containsXY(1, 2)).to.equal(true);
    });

    it('should return false if the (x,y) is not in the set', function() {
      cellSet.add(new Cell({ x: 1, y: 2 }));
      expect(cellSet.containsXY(1, 1)).to.equal(false);
    });
  });

  describe('pruneByCollinearity', function() {
    it('should prune interior points properly', function() {
      cellSet.add(new Cell({ x: 0, y: 0 }));
      cellSet.add(new Cell({ x: 1, y: 1 }));
      cellSet.add(new Cell({ x: 2, y: 2 }));
      cellSet.add(new Cell({ x: 0, y: 1 }));

      var result = cellSet.pruneByCollinearity();
      expect(result.cells.length).to.equal(3);
      expect(result.cellHashes[1 << 24 + 1]).to.equal(undefined);
    });

    it('should be able to remove the end point, if its collinear with the next to last and end point', function() {
      cellSet.add(new Cell({ x: 2, y: 2 }));
      cellSet.add(new Cell({ x: 0, y: 1 }));
      cellSet.add(new Cell({ x: 0, y: 0 }));
      cellSet.add(new Cell({ x: 1, y: 1 }));

      var result = cellSet.pruneByCollinearity();
      expect(result.cells.length).to.equal(3);
      expect(result.cellHashes[1 << 24 + 1]).to.equal(undefined);
    });

    it('should be able to remove the first point, if its collinear with the last and second', function() {
      cellSet.add(new Cell({ x: 1, y: 1 }));
      cellSet.add(new Cell({ x: 2, y: 2 }));
      cellSet.add(new Cell({ x: 0, y: 1 }));
      cellSet.add(new Cell({ x: 0, y: 0 }));

      var result = cellSet.pruneByCollinearity();
      expect(result.cells.length).to.equal(3);
      expect(result.cellHashes[1 << 24 + 1]).to.equal(undefined);
    });
  });

  describe('cells', function() {
    it('should not leave out cells', function() {
      cellSet.add(new Cell({ x: 1, y: 1 }));
      cellSet.add(new Cell({ x: 2, y: 2 }));
      cellSet.add(new Cell({ x: 3, y: 3 }));

      expect(cellSet.cells.length).to.equal(3);
    });

    it('should scale well', function() {
      var N = 500;
      for(var i = 0; i < N; i++) {
        for(var j = 0; j < N; j++) {
          cellSet.add(new Cell({ x: i, y: j }));
        }
      }

      var cells = cellSet.cells;
      expect(cells.length).to.equal(Object.keys(cellSet.cellHashes).length);
    });
  });
});
