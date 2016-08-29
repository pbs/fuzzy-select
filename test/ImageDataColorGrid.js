var expect = require('chai').expect;
var Cell = require('../Cell');
var ImageDataColorGrid = require('../ImageDataColorGrid');

describe('ImageDataColorGrid', function() {
  describe('get', function() {
    it('should unpack height and width values appropriately', function() {
      // Emulate ImageData instance
      var colors = [
        /* (0, 0) */ 1,  2,  3,  4, /* (1, 0) */  5,  6,  7, 8,
        /* (0, 1) */ 9, 10, 11, 12, /* (1, 1) */ 13, 14, 15, 16
      ];
      var imageData = {
        data: colors,
        width: 2,
        height: 2
      };

      var colorGrid = new ImageDataColorGrid(imageData);

      expect(colorGrid.get(new Cell({ x: 0, y: 0 }))).to.deep.equal({ r: 1, g: 2, b: 3, a: 4 })
      expect(colorGrid.get(new Cell({ x: 1, y: 0 }))).to.deep.equal({ r: 5, g: 6, b: 7, a: 8 })
      expect(colorGrid.get(new Cell({ x: 0, y: 1 }))).to.deep.equal({ r: 9, g: 10, b: 11, a: 12 })
      expect(colorGrid.get(new Cell({ x: 1, y: 1 }))).to.deep.equal({ r: 13, g: 14, b: 15, a: 16 })
    });

    it('should handle mixed width and height appropriately', function() {
      // Emulate ImageData instance
      var colors = [
        /* (0, 0) */ 0, 0, 0, 0, /* (1, 0) */ 0, 0, 0, 0, /* (2, 0) */ 0, 0, 0, 0,
        /* (0, 1) */ 1, 1, 1, 1, /* (1, 1) */ 0, 0, 0, 0, /* (2, 1) */ 0, 0, 0, 0
      ];
      var imageData = {
        data: colors,
        width: 3,
        height: 2
      };

      var colorGrid = new ImageDataColorGrid(imageData);
      expect(colorGrid.get(new Cell({ x: 0, y: 1 }))).to.deep.equal({ r: 1, g: 1, b: 1, a: 1 });
    });
  });
});
