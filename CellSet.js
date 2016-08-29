var Cell = require('./Cell');

/**
 * An indexed set of cells. Uses JS's native object hashing for fast lookup
 */
var CellSet = function() {
  this.head = null;
  this.tail = null;
  this.cellHashes = {};
};

/**
 * Adds an element to the set (idempotent)
 * @param {Cell} cell The cell to add
 */
CellSet.prototype.add = function(cell) {
  if(this.contains(cell)) {
    return;
  }

  if(this.head == null) {
    this.head = cell.id;
  } else {
    this.cellHashes[this.tail] = cell.id;
  }
  this.tail = cell.id;
  this.cellHashes[cell.id] = null;
};

/**
 * Determines if a given cell is already in the set
 * @param {Cell} cell The cell to check for
 * @return {Boolean}
 */
CellSet.prototype.contains = function(cell) {
  return this.cellHashes[cell.id] !== undefined;
};

/**
 * Determines if a given cell is already in the set, for a given x,y pair
 * @param {Number} x The x value to check
 * @param {Number} y The y value to check
 * @return {Boolean}
 */
CellSet.prototype.containsXY = function(x, y) {
  return this.cellHashes[Cell.hash(x, y)] !== undefined;
};

/**
 * Converts the set to a string
 * @return {String}
 */
CellSet.prototype.toString = function() {
  return Object.keys(this.cellHashes).join(', ');
}

/**
 * Returns a new cell set with any collinear points removed. This is helpful for dealing with cell sets that represent
 * a boundary, and will prune it down to the minimal points needed to make an equivalent boundary
 * @return {CellSet}
 */
CellSet.prototype.pruneByCollinearity = function() {
  var cellSet = new CellSet();
  var oldCells = this.cells;

  var N = oldCells.length;
  for(var i = 0; i < N; i++) {
    var cell1 = oldCells[i];
    var cell2 = oldCells[(i + 1) % N];
    var cell3 = oldCells[(i + 2) % N];

    if(!Cell.areCollinear(cell1, cell2, cell3)) {
      cellSet.add(cell2);
    }
  }

  return cellSet;
};

Object.defineProperties(CellSet.prototype, {
  cells: {
    get: function() {
      var cells = [];
      var current = this.head;
      while(current !== null) {
        cells.push(Cell.fromId(current));
        current = this.cellHashes[current]; 
      }

      return cells;
    }
  }
});

module.exports = CellSet;
