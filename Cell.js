/**
 * Simple class for representing a cell in a graph
 *
 * @param {Object} cell An { x, y } object to convert to a cell instance
 */
var Cell = function(cell) {
  this.x = cell.x;
  this.y = cell.y;
  this.id = cell.id === undefined ? Cell.hash(this.x, this.y) : cell.id;
};

/**
 * The number of bits to shift when hashing
 * @var Cell.SHIFT_SIZE
 */
Cell.SHIFT_SIZE = 16;

/**
 * The direction deltas associated with each direction a cell can be related
 *
 * @static
 * @var Cell.DELTAS
 */
Cell.DELTAS = {
  NORTH: { x: 0, y: -1 },
  WEST: { x: -1, y: 0 },
  SOUTH: { x: 0, y: 1 },
  EAST: { x: 1, y : 0 },
  NORTHWEST: { x: -1, y: -1 },
  SOUTHWEST: { x: -1, y: 1 },
  SOUTHEAST: { x: 1, y: 1 },
  NORTHEAST: { x: 1, y : -1 },
};

/**
 * A list of the possible headings
 * @static
 * @var Cell.HEADINGS
 */
Cell.HEADINGS = Object.keys(Cell.DELTAS);

/**
 * A map to opposite directions
 * @static
 * @var Cell.OPPOSITE_HEADINGS
 */
Cell.OPPOSITE_HEADINGS = {
  NORTH: 'SOUTH',
  WEST: 'EAST',
  SOUTH: 'NORTH',
  EAST: 'WEST',
  NORTHWEST: 'SOUTHEAST',
  NORTHEAST: 'SOUTHWEST',
  SOUTHWEST: 'NORTHEAST',
  SOUTHEAST: 'NORTHWEST',
};

/**
 * A list of cardinal headings only. This is used to make flood fill behave properly around corners
 * @static
 * @var Cell.CARDINAL_HEADINGS
 */
Cell.CARDINAL_HEADINGS = ['NORTH', 'WEST', 'SOUTH', 'EAST'];

/**
 * Returns true if two cells are equal
 *
 * @param {Cell} other Another cell to compare to
 * @return {Boolean}
 */
Cell.prototype.equals = function(other) {
  return this.id === other.id;
};

/**
 * Calculates what the neighbor cell would be in a particular direction. Doesn't actually check if the cell is in the
 * graph
 * @param {Cell} cell
 * @param {String} direction One of Cell.HEADINGS values
 * @return {Cell}
 */
Cell.prototype.move = function(direction) {
  var delta = Cell.DELTAS[direction];

  return new Cell({
    x: this.x + delta.x,
    y: this.y + delta.y
  });
};

/**
 * Hash function to get a unique id for a cell
 */
Cell.hash = function(x, y) {
  return ((x + 1) << Cell.SHIFT_SIZE) + y + 1;
}

/**
 * Parses an id to convert to a cell instance
 *
 * @static
 * @param {String} id An id to parse
 * @return {Cell}
 */
Cell.fromId = function(id) {
  return new Cell({
    x: (id >>> Cell.SHIFT_SIZE) - 1,
    y: (id & 0xffff) - 1, // TODO: Don't hardcode this...
    id: Number(id)
  });
};

/**
 * Checks if three points are collinear, returning true if they are
 *
 * @param {cell1} cell1 The first cell
 * @param {cell2} cell2 The second cell
 * @param {cell3} cell3 The third cell
 * @return {Boolean}
 */
Cell.areCollinear = function(cell1, cell2, cell3) {
  var dx1 = cell2.x - cell1.x;
  var dy1 = cell2.y - cell1.y;
  var dx2 = cell3.x - cell2.x;
  var dy2 = cell3.y - cell2.y;

  return ( (dx1 * dy2) - (dx2 * dy1) ) === 0;
};

module.exports = Cell;
