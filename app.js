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

setStatus('Making color grid');
var colorGrid = makeColorGrid(5000);
setStatus('Ready.');

document.querySelector('#fuzzy-select').addEventListener('click', function() {
  var button = this;
  button.disabled = true;

  var selector = new FuzzySelector(colorGrid);

  setStatus('Selecting');
  
  var t1 = Date.now();

  // select a region
  var generator = selector.selectIteratively(1, 0, 20);
  var stepsPerFrame = 10;
  var doSteps = function() {
    var i = 0, current = { done: false, value: undefined };
    while(i < stepsPerFrame && !current.done) {
      current = generator.next();
      i++;
    }

    if(current.done) {
      var t2 = Date.now();
      setStatus('Selected in ' + (t2 - t1) + 'ms');
      button.disabled = false;
      return;
    }

    requestAnimationFrame(doSteps);
  };

  requestAnimationFrame(doSteps);
});
