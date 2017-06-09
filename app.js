var ImageDataColorGrid = require('./ImageDataColorGrid');
var FuzzySelector = require('./FuzzySelector');
var Graph = require('./Graph');

var setStatus = function(value) {
    document.getElementById('status').innerText = value;
}

setStatus('Making color grid');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var colorGrid = new ImageDataColorGrid(ctx.getImageData(0, 0, canvas.width, canvas.height));
setStatus('Ready.');

var colors = ['#F41971', '#23C2F2', '#FCB017'];
var colorIndex = 0;

document.querySelector('#fuzzy-select').addEventListener('click', function() {
  ctx.strokeStyle = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;

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

    // now draw the range set object
    ctx.beginPath();
    current.value.forEachRange(function(x, yRange) {
      ctx.moveTo(x, yRange.min);
      ctx.lineTo(x, yRange.max);
    });
    ctx.stroke();

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
