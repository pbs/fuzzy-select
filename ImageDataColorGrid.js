/**
 * A wrapper class for ImageData to make it easier to get pixel color values
 *
 * @param {ImageData} imageData The image data from the canvas to wrap
 */
var ImageDataColorGrid = function(imageData) {
  this.imageData = imageData;
};

ImageDataColorGrid.prototype.getXY = function(x, y) {
  var offset = (this.imageData.width * y + x) << 2;

  return {
    r: this.imageData.data[offset + 0],
    g: this.imageData.data[offset + 1],
    b: this.imageData.data[offset + 2],
    a: this.imageData.data[offset + 3]
  };
}

module.exports = ImageDataColorGrid;
