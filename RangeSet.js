/**
 * Represents a set of y-ranges, positioned at x coordinates. Perhaps a set of scanlines?
 */
var RangeSet = function() {
  this.ranges = {};
  this._last = null;
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

  this._last = {
    x: x,
    range: range
  };
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

/**
 * Retrieves the last value added to the range set for iterative drawing improvements
 * @return {Object}
 * @return {Object.x} The x value of the scanline
 * @return {Object.range} The range set of the scanline
 */
Object.defineProperty(RangeSet.prototype, 'last', {
  get: function() {
    return this._last;
  },
  enumerable: true,
  configurable: true
});

module.exports = RangeSet;
