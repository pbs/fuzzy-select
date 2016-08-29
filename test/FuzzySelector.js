var expect = require('chai').expect;
var ImageDataColorGrid = require('../ImageDataColorGrid');
var FuzzySelector = require('../FuzzySelector');

describe('FuzzySelector', function() {
  describe('select', function() {
    it('should return a graph with all values with smaller color distance tolerance', function() {
      var colors = [
        0, 0, 0, 0,    0, 0, 0, 0,
        0, 0, 0, 0,    1, 1, 1, 1
      ];
      var imageData = {
        data: colors,
        width: 2,
        height: 2
      }
      var colorGrid = new ImageDataColorGrid(imageData);
      var selector = new FuzzySelector(colorGrid);
      var set = selector.select(0, 0, 1);
      expect(set.boundaries().cells.length).to.equal(3);
    });

    it('should not leak through corners', function() {
      var colors = [
        0, 0, 0, 0,    1, 1, 1, 1,
        1, 1, 1, 1,    0, 0, 0, 0
      ];
      var imageData = {
        data: colors,
        width: 2,
        height: 2
      }
      var colorGrid = new ImageDataColorGrid(imageData);
      var selector = new FuzzySelector(colorGrid);
      var set = selector.select(0, 0, 1);
      expect(set.contains(1, 1)).to.equal(false);
    });

    it('should not leave out cells', function() {
      var imageData = { data: [], width: 5, height: 5 };
      for(var i = 0; i < 5 * 5 * 4; i++) {
        imageData.data.push(0);
      }
      var colorGrid = new ImageDataColorGrid(imageData);
      var selector = new FuzzySelector(colorGrid);
      var set = selector.select(1, 1, 20);
      expect(set.boundaries().cells.length).to.equal(10);
    });

    it('should handle diagonals properly', function() {
      var imageData = {
        data: [
          0, 0, 0, 0,  0, 0, 0, 0,  1, 1, 1, 1,  0, 0, 0, 0,
          0, 0, 0, 0,  1, 1, 1, 1,  1, 1, 1, 1,  0, 0, 0, 0,
          0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,
          0, 0, 0, 0,  1, 1, 1, 1,  1, 1, 1, 1,  0, 0, 0, 0,
          0, 0, 0, 0,  0, 0, 0, 0,  1, 1, 1, 1,  0, 0, 0, 0,
        ],
        width: 4,
        height: 5
      };
      var colorGrid = new ImageDataColorGrid(imageData);
      var selector = new FuzzySelector(colorGrid);
      var set = selector.select(3, 3, 1);
      expect(set.boundaries().cells.length).to.equal(8);
    });
  });

  describe('colorDistance', function() {
    it('should return zero for identical colors', function() {
      var c = { r: 1, g: 2, b: 3, a: 4 };
      expect(FuzzySelector.colorDistance(c, c)).to.equal(0);
    });

    it('should return a positive distance for non-equal colors', function() {
      var c1 = { r: 1, g: 2, b: 3, a: 4 };
      var c2 = { r: 2, g: 3, b: 5, a: 0 };

      var c1c2 = FuzzySelector.colorDistance(c1, c2);
      var c2c1 = FuzzySelector.colorDistance(c2, c1);
      expect(c1c2).to.equal(c2c1);
      expect(c1c2).to.be.greaterThan(0);
    });

    it('should treat alpha of 0 as white', function() {
      var c1 = { r: 0, g: 0, b: 0, a: 0 }; // black with full opacity
      var c2 = { r: 255, g: 255, b: 255, a: 255 }; // translucent white
      expect(FuzzySelector.colorDistance(c1, c2)).to.equal(0);
    });
  });
});
