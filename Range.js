/**
 * Represents a range of numbers
 * @param {Number} min The min value (inclusive)
 * @param {Number} max The max value (inclusive)
 */
var Range = function(min, max) {
  this.min = min;
  this.max = max;
}

/**
 * Returns true if the range contains a given value
 * @param {Number} value The value to check
 * @return {Boolean}
 */
Range.prototype.contains = function(value) {
  return value >= this.min && value <= this.max;
};

module.exports = Range;
