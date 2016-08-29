var ImageDataColorGrid = require('./ImageDataColorGrid');
var FuzzySelector = require('./FuzzySelector');
var Graph = require('./Graph');

var setStatus = function(value) {
    document.getElementById('status').innerText = value;
}

var makeColorGrid = function(size) {
  var canvas = document.createElement('canvas');
  canvas.height = size;
  canvas.width = size;
  return new ImageDataColorGrid(canvas.getContext('2d').getImageData(0, 0, size, size));
}


document.querySelector('#fuzzy-select').addEventListener('click', function() {
  setStatus('Making color grid');
  var colorGrid = makeColorGrid(5000);
  var selector = new FuzzySelector(colorGrid);

  setStatus('Selecting');
  
  var t1 = Date.now();

  // select a region
  var selectedRegion = selector.select(1, 0, 20);

  var t2 = Date.now();

  setStatus('Selected in ' + (t2 - t1) + 'ms');
});
