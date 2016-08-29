var expect = require('chai').expect;
var Cell = require('../Cell.js');
var Graph = require('../Graph.js');

describe('Graph', function() {
  describe('add', function() {
    it('should correctly establish adjacency', function() {
      var g = new Graph([]);
      var c1 = new Cell({ x: 1, y: 1 });
      var c2 = new Cell({ x: 2, y: 1 });
      g.add(c1);
      g.add(c2);

      expect(g.adjacency[c1.id].EAST).to.equal(c2.id);
      expect(g.adjacency[c2.id].WEST).to.equal(c1.id);
    });
  });

  describe('contains', function() {
    it('should return true if the cell is in the list', function() {
      var c = new Cell({ x: 1, y: 2 });
      var g = new Graph([c]);
      expect(g.contains(c)).to.equal(true);
    });

    it('should return false if the cell is not in the list', function() {
      var c = new Cell({ x: 1, y: 2 });
      var g = new Graph([c]);

      var c2 = new Cell({ x: 1, y: 5 });
      expect(g.contains(c2)).to.equal(false);
    });
  });

  describe('hasNeighborInDirection', function() {
    it('should work', function() {
      var cells = [
        new Cell({ x: 1, y: 1 }),
        new Cell({ x: 2, y: 1 })
      ];

      var g = new Graph(cells);
      expect(g.hasNeighborInDirection(cells[0], 'EAST')).to.equal(true);
      expect(g.hasNeighborInDirection(cells[1], 'WEST')).to.equal(true);
      expect(g.hasNeighborInDirection(cells[1], 'NORTH')).to.equal(false);
    });
  });

  describe('cellIsBoundary', function() {
    var cells = [];
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        cells.push(new Cell({ x: i, y: j }));
      }
    }
    cells.push(new Cell({ x: -1, y: 0 }));
    cells.push(new Cell({ x: 0, y: -1 }));
    var g = new Graph(cells);

    it('should return false if it has neighbors in all directions', function() {
      expect(g.cellIsBoundary(new Cell({ x: 1, y: 1 }))).to.equal(false);
    });

    it('should return true if it does not have neighbors in all directions', function() {
      expect(g.cellIsBoundary(new Cell({ x: 0, y: 1 }))).to.equal(true);
    });

    it('should handle corner cases properly', function() {
      expect(g.cellIsBoundary(new Cell({ x: 0, y: 0 }))).to.equal(true);
    });
  });

  describe('neighbors', function() {
    it('should return an array of the neighbors that are in the graph only', function() {
      var cells = [
        new Cell({ x: 1, y: 1 }),
        new Cell({ x: 2, y: 1 }),
        new Cell({ x: 3, y: 1 })
      ];

      var g = new Graph(cells);
      var neighbors = g.neighbors(cells[0]);
      expect(neighbors.length).to.equal(1);
      expect(neighbors[0].id).to.equal(Cell.hash(2, 1));
    });
  });

  describe('findOuterBoundaryPoint', function() {
    it('should return the min (x,y) that is a boundary point', function() {
      var cells = [];
      for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
          if(i != 3 && j != 3) {
            cells.push(new Cell({ x: i, y: j }));
          }
        }
      }
      var g = new Graph(cells); // a lattice with a hole in it at (3,3)

      var boundary = g.findOuterBoundaryPoint();
      expect(boundary.id).to.equal(Cell.hash(0, 0));
    });
  });

  describe('followBoundary', function() {
    it('should return the proper CCW-winding boundary, provided a starting cell', function() {
      var cells = [];
      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          cells.push(new Cell({ x: i, y: j }));
        }
      }
      var g = new Graph(cells);

      var boundary = g.followBoundary(cells[0]);
      var ids = boundary.cells.map(cell => cell.id);
      ids.sort();

      var expectedIds = [
        Cell.hash(0, 0),
        Cell.hash(1, 0),
        Cell.hash(2, 0),
        Cell.hash(2, 1),
        Cell.hash(2, 2),
        Cell.hash(1, 2),
        Cell.hash(0, 2),
        Cell.hash(0, 1),
      ];
      expectedIds.sort();

      expect(ids).to.deep.equal(expectedIds);
    });

    it('should prefer cardinal directions because it prevents points from being left out', function() {
      var cells = [
        new Cell({ x: 2, y: 0 }),
        new Cell({ x: 1, y: 0 }),
        new Cell({ x: 1, y: 1 }),
        new Cell({ x: 0, y: 1 }),
        new Cell({ x: 0, y: 2 }),
        new Cell({ x: 0, y: 3 }),
      ];
      var g = new Graph(cells);
      var boundary = g.followBoundary(cells[0]);
      expect(boundary.cells.length).to.equal(cells.length);
    });
  });

  describe('findBoundaryExcluding', function() {
    it('should find boundaries excluding the boundary provided', function() {
      var g = new Graph([
        new Cell({ x: 0, y: 0 }),
        new Cell({ x: 0, y: 1 }),
        new Cell({ x: 2, y: 0 }),
        new Cell({ x: 2, y: 1 })
      ]);
      
      var mainBoundary = g.followBoundary(new Cell({ x: 0, y: 0 }));
      var newBoundary = g.findBoundaryExcluding([mainBoundary]);
      expect(newBoundary).to.not.equal(null);
    });

    it('should return null if there is no boundary', function() {
      var g = new Graph([ Cell.fromId('0|0'), Cell.fromId('0|1') ]);

      var mainBoundary = g.followBoundary(Cell.fromId('0|0'));

      var newBoundary = g.findBoundaryExcluding([mainBoundary]);
      expect(newBoundary).to.equal(null);
    });
  });

  describe('allBoundaries', function() {
    it('should return all boundaries if there are many', function() {
      var cells = [];
      for(var i = 0; i < 20; i++) {
        for(var j = 0; j < 20; j++) {
          // Add two holes
          if(i === 5 && j === 5) {
            continue;
          }
          if(i == 10 && j == 10) {
            continue;
          }
          
          cells.push(new Cell({ x: i, y: j }));
        }
      }
      var graph = new Graph(cells);

      var boundaries = graph.allBoundaries();
      expect(boundaries.length).to.equal(3);
    });
  });
});
