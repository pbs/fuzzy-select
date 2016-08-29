var Cell = require('./Cell');
var CellSet = require('./CellSet');

/**
 * Represents a set of y-ranges, positioned at x coordinates. Perhaps a set of scanlines?
 */
var RangeSet = function() {
  this.ranges = {};
};

/**
 * Adds a new range to the set
 * @param {Range} range The range to add
 * @param {Number} x The x coordinate at which to add it
 */
RangeSet.prototype.add = function(range, x) {
  if(this.ranges[x] === undefined) {
    this.ranges[x] = [];
  }

  this.ranges[x].push(range);
};

/**
 * Returns true if the passed point is contained in the set
 * @param {Number} x The x coordinate
 * @param {Number} y The y coordinate
 * @return {Boolean}
 */
RangeSet.prototype.contains = function(x, y) {
  if(this.ranges[x] === undefined) {
    return false;
  }

  var ranges = this.ranges[x];
  for(var i = 0; i < ranges.length; i++) {
    if(ranges[i].contains(y)) {
      return true;
    }
  }

  return false;
}

/**
 * Provides a nice way to loop over all of the ranges in the set
 * @param {Function} F a callback for each range value. First param will be x, and the sencond is the y-range
 */
RangeSet.prototype.forEachRange = function(F) {
  var xValues = Object.keys(this.ranges);
  for(var i = 0; i < xValues.length; i++) {
    var x = Number(xValues[i]);
    var yRanges = this.ranges[x];
    for(var j = 0; j < yRanges.length; j++) {
      F(x, yRanges[j]);
    }
  }
};

/**
 * Enumerates all of the boundaries of the set
 * @return {CellSet}
 */
RangeSet.prototype.boundaries = function() {
  var cells = new CellSet();
  this.forEachRange(function(x, y) {
    cells.add(new Cell({ x: x, y: y.min }));
    cells.add(new Cell({ x: x, y: y.max }));
  });

  return cells;
};

/**
 * Converts the range set into a valid SVG path description
 * @return {String}
 */
RangeSet.prototype.toPathString = function() {
  var path = 'M0,0';
  this.forEachRange(function(x, y) {
    path += ' M' + x + ',' + y.min;
    path += ' L' + x + ',' + y.max;
  });
  return path;
};

module.exports = RangeSet;
