var Cell = require('./Cell');
var CellSet = require('./CellSet');

/**
 * Represents a lattice graph of cells
 * @param {Array[Cell]} cells The array of cells to build the graph from
 */
var Graph = function(cells) {
  this.adjacency = {};
  this.cellHashes = [];
  for(var i = 0; i < cells.length; i++) {
    this.add(cells[i]);
  }
};

/**
 * Adds a cell to the set
 * @param {Cell} cell The cell to add
 */
Graph.prototype.add = function(cell) {
  var neighbors = {}, heading, neighbor;
  for(var i = 0; i < Cell.HEADINGS.length; i++) {
    heading = Cell.HEADINGS[i];
    neighbor = cell.move(heading);
    if(this.contains(neighbor)) {
      neighbors[heading] = neighbor.id; 
      this.adjacency[neighbor.id][Cell.OPPOSITE_HEADINGS[heading]] = cell.id; 
    }
  }

  this.cellHashes.push(cell.id);
  this.adjacency[cell.id] = neighbors;
};

/**
 * Determines if a cell is in the graph
 * @param {Cell} cell The cell check for
 * @return {Boolean}
 */
Graph.prototype.contains = function(cell) {
  return this.adjacency[cell.id] !== undefined;
};

/**
 * Returns all neighbors of a particular cell, that are in this graph
 * @param {Cell} cell The cell to check for
 * @return {Array[Cell]}
 */
Graph.prototype.neighbors = function(cell) {
  var neighborHeadings = Object.keys(this.adjacency[cell.id]);
  var neighbors = [];
  for(var i = 0; i < neighborHeadings.length; i++) {
    var id = this.adjacency[cell.id][neighborHeadings[i]];
    neighbors.push(Cell.fromId(id));
  }
  return neighbors;
};

/**
 * Checks if a cell has a neighbor in a particular direction
 * @param {Cell} cell The cell to chedck for
 * @param {String} direction One of the Cell.HEADINGS values
 * @return {Boolean}
 */
Graph.prototype.hasNeighborInDirection = function(cell, direction) {
  return this.adjacency[cell.id][direction] !== undefined;
};

/**
 * Checks if a particular cell is a boundary cell
 * @param {Cell} cell The cell to check
 * @return {Boolean}
 */
Graph.prototype.cellIsBoundary = function(cell) {
  return Object.keys(this.adjacency[cell.id]).length < 8;
};

/**
 * Finds a boundary point on the outside of the lattice graph
 * @return {Cell}
 */
Graph.prototype.findOuterBoundaryPoint = function() {
  var bestCell = Cell.fromId(this.cellHashes[0]);
  for(var i = 1; i < this.cellHashes.length; i++) {
    var cell = Cell.fromId(this.cellHashes[i]);
    if(this.cellIsBoundary(cell) && cell.x < bestCell.x) {
      bestCell = cell;
    }
  }
  return bestCell;
};

/**
 * Given a starting point, finds all points that together define a boundary for the graph. The graph could be made up
 * of many boundaries (for instance, if it has holes), but this method simply finds the one containing the passed
 * starting point
 *
 * @param {Cell} startingPoint The starting point for the search
 * @return {CellSet}
 */
Graph.prototype.followBoundary = function(startingPoint) {
  var graph = this;
  var currentPoint = startingPoint;
  var boundary = new CellSet();
  boundary.add(currentPoint);
  while(true) {
    var nextPoint = null;
    for(var i = 0; i < Cell.HEADINGS.length; i++) {
      var neighbor = currentPoint.move(Cell.HEADINGS[i]);
      if(graph.contains(neighbor) && graph.cellIsBoundary(neighbor) && !boundary.contains(neighbor)) {
        nextPoint = neighbor;
        break;
      }
    }

    if(nextPoint === null) {
      break;
    }
    else {
      boundary.add(nextPoint);
      currentPoint = nextPoint;
    }
  }

  return boundary;
};

/**
 * Finds a boundary given that the passed boundaries have already been found. If there are no more boundaries, this
 * method returns null
 * @param {Array[CellSet]} otherBoundaries The boundaries that have already been found
 * @return {CellSet|null}
 */
Graph.prototype.findBoundaryExcluding = function(otherBoundaries) {
  var unusedBoundaryPoint = null;
  for(var i = 0; i < this.cellHashes.length; i++) {
    var cell = Cell.fromId(this.cellHashes[i]);

    // if it's not a boundary, ignore it
    if(!this.cellIsBoundary(cell)) {
      continue;
    }

    var cellIsInOtherBoundaries = false;
    for(var j = 0; j < otherBoundaries.length; j++) {
      if(otherBoundaries[j].contains(cell)) {
        cellIsInOtherBoundaries = true;
        break;
      }
    }

    if(!cellIsInOtherBoundaries) {
      unusedBoundaryPoint = cell;
    }
  }

  if(unusedBoundaryPoint === null) {
    return null;
  }

  return this.followBoundary(unusedBoundaryPoint);
};

/**
 * Finds all boundaries for this particular lattice graph. Will always have at least one boundary, and the first
 * element returned will be the outermost boundary
 * @return {Array[CellSet]}
 */
Graph.prototype.allBoundaries = function() {
  var graph = this;
  var boundaries = [];
  var outerBoundaryPoint = this.findOuterBoundaryPoint();
  boundaries.push(graph.followBoundary(outerBoundaryPoint));
  while(true) {
    var nextBoundary = graph.findBoundaryExcluding(boundaries);
    if(nextBoundary === null) {
      break;
    }
    boundaries.push(nextBoundary);
  }

  return boundaries;
};

module.exports = Graph;
