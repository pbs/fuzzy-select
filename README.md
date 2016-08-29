# Flood Fill
Contains some flood fill algorithm tools, plus more tools for finding bounding polygons for a colored region of a
canvas

## Example usage
First, let's say you have a canvas on the page with id `my-canvas`. Here's a way that you might get a "fuzzy region" of
all connected places with the same color
```javascript
const {ImageDataColorGrid, FuzzySelector} = require('fuzzy-select/ImageDataColorGrid');

// wrap your canvas with a color grid instance
var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var colorGrid = new ImageDataColorGrid(imageData);

var tolerance = 10;

// now, select the region, starting from (0,0)
var selector = new FuzzySelector(colorGrid);
var selectedRegion = selector.select(0, 0, tolerance);
```
`selectedRegion` is a `RangeSet` object, which is essentially a set of y-ranges with specified x-coordinates. With
this, you can query if a point is in the region:
```
selectedRegion.contains(1, 2);
```
or, even loop over all the different ranges in the set:
```
selectedRegion.forEachRange(function(x, yRange) {
    console.log(`x=${x} y=[${yRange.min}, ${yRange.max}] is in the region`);
});
```
In fact, this can be used to draw the region (see [app.js](/app.js)).

## Reading from a non-canvas
This code can also be used for fuzzy selection on any sort of 2 dimensional grid, but will require some work on your\
part. In order to do so, you'll need to implement your own custom version of `ImageDataColorGrid` that implements an a
`get` and `getXY` method. Both of these should return an object with an `r`, `g`, `b`, and `a` keys so that the existing
color diff algorithm will work properly. For an example implementation, see `ImageDataColorGrid.js`.
