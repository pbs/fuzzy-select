var Range = require('./Range');
var RangeSet = require('./RangeSet');

/**
 * Helper class for selecting a region based on fuzzy tolerance
 *
 * @param {ImageDataColorGrid} colorGrid The color grid instance to use for the selector
 */
var FuzzySelector = function(colorGrid) {
  this.colorGrid = colorGrid;
};

/**
 * Selects a region based a "color delta" defined in `colorDistance`. First, selects the color that is being pointed to
 * by the passed cell, and then selects neighboring points by ensuring they are with a color distance tolerance
 * specified by the passed parameter. This parameter defaults to 0.
 * @param {Number} x The x position to select from
 * @param {Number} y The y position to select from
 * @param {Number} tolerance The tolerance for allowing colors
 * @return {RangeSet} A set of scanlines that are in the fuzzy selected region
 */
FuzzySelector.prototype.select = function(x, y, tolerance) {
  tolerance = tolerance || 0;

  var selector = this;
  var visited = new RangeSet;
  var needToVisit = [ { x: x, y: y }];
  var cellColor = selector.colorGrid.getXY(x, y);

  var withinTolerance = function(x, y) {
    var color = selector.colorGrid.getXY(x, y);
    return FuzzySelector.colorDistance(cellColor, color) < tolerance;
  };

  while(needToVisit.length > 0) {
    var current = needToVisit.pop();
    var x = current.x;
    var y = current.y;

    // march north until we hit the top or a color boundary
    while(y >= 0 && withinTolerance(x, y)) {
      y--;
    }
    y++;

    var topY = y;

    var left = x - 1, right = x + 1;
    var leftInBounds = left >= 0;
    var rightInBounds = right < selector.colorGrid.imageData.width;
    var tryReachLeft = true, tryReachRight = true;

    // while y is in bounds?
    while(y < selector.colorGrid.imageData.height && withinTolerance(x, y)) {
      if(leftInBounds) {
        var leftInTolerance = withinTolerance(left, y);
        
        if(tryReachLeft && leftInTolerance && !visited.contains(left, y)) {
          needToVisit.push({ x: left, y: y });
          tryReachLeft = false;
        } else if(!tryReachLeft && !leftInTolerance) {
          tryReachLeft = true;
        }
      }
      
      if(rightInBounds) {
        var rightInTolerance = withinTolerance(right, y);
        
        if(tryReachRight && rightInTolerance && !visited.contains(right, y)) {
          needToVisit.push({ x: right, y: y });
          tryReachRight = false;
        } else if(!tryReachRight && !rightInTolerance) {
          tryReachRight = true;
        }
      }

      y++;
    }
    y--;
    var bottomY = y;

    visited.add(new Range(topY, bottomY), x);
  }

  return visited;
};

FuzzySelector.washOutColor = function(component, alpha) {
  return 255 + alpha * (component - 255) / 255
}

/**
 * Calculates the color distance between two colors. This is the metric to define if a color is "close enough" to
 * another color to be included in a fuzzy selection
 * @param {Object} color1 The first color { r, g, b, a }
 * @param {Object} color2 The second color { r, g, b, a }
 */
FuzzySelector.colorDistance = function(color1, color2) {
  // This is an optimized version of an original algorithm I implemented. There a couple of things to note here:
  // * Alpha can be treated as "whitening" the color, since the background is white. So, lesser alpha corresponds to a
  //   whiter color. The whitening is calculated via linear interpolation between white and the existing color.
  // * This object below is an unscaled version of the difference of color1 and color2 *after* it has been whitened
  //   from it's alpha. 
  var delta = {
    r: color1.a * (color1.r - 255) - color2.a * (color2.r - 255),
    g: color1.a * (color1.g - 255) - color2.a * (color2.g - 255),
    b: color1.a * (color1.b - 255) - color2.a * (color2.b - 255),
  };

  // Now we take the manhattan distance and perform the division right at the end
  return (Math.abs(delta.r) + Math.abs(delta.g) + Math.abs(delta.b)) / 255;
};

module.exports = FuzzySelector;
