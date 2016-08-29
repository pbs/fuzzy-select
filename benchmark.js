var Cell = require('./Cell');
var ImageDataColorGrid = require('./ImageDataColorGrid');
var FuzzySelector = require('./FuzzySelector');
var Graph = require('./Graph');

// Helper for stubbing an image data object
var makeImageData = function(N) {
  return {
    data: new Uint32Array(N * N * 4),
    width: N,
    height: N
  };
};

var benchmark = function(F, numberOfTimesToRun) {
  var t1 = Date.now();
  for(var i = 0; i < numberOfTimesToRun; i++) {
    F(i);
  }
  var t2 = Date.now();
  return (t2 - t1);
}

var sizesToUse = [1000, 1500, 2000, 2500, 3000];

sizesToUse.forEach(function(N) {
  console.log(`N=${N}`);

  var imageData = makeImageData(N);

  var centerCell = new Cell({ x: Math.round(N / 2), y: Math.round(N/2) });

  var colorGrid = new ImageDataColorGrid(imageData);
  var selector = new FuzzySelector(colorGrid);

  var select = () => selector.select(centerCell, 25);
  var averageMillis = benchmark(select, 100000);
  console.log(`  select: ${averageMillis}ms`);

  var getXY = () => colorGrid.getXY(10, 20);
  averageMillis = benchmark(getXY, 1000000);
  console.log(`  getXY: ${averageMillis}ms`);

  var color = {
    r: 200,
    g: 100,
    b: 50,
    a: 150
  };
  var colorDistance = () => FuzzySelector.colorDistance(color, color);
  averageMillis = benchmark(colorDistance, 20000000);
  console.log(`  colorDistance: ${averageMillis}ms`);
});
