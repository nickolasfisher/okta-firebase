const { createCanvas, createImageData } = require("canvas");

const eColor = [255, 0, 0, 155];
const wColor = [45, 87, 55, 155];
const sColor = [255, 125, 14, 155];
const noColor = [154, 154, 154, 155];
const percent = 45;
let maxX;
let minY;

let checked = [];

const checkPoint = (point) => {
  if (checked.indexOf(point) === -1) {
    checked.push(point);
    const roll = Math.random() * 100;
    if (roll < percent) return true;
  }

  return false;
};

const buildNeighbors = (point) => {
  const south = {
    x: point.x,
    y: point.y - 1,
    color: sColor,
  };

  const east = {
    x: point.x + 1,
    y: point.y,
    color: eColor,
  };

  const west = {
    x: point.x - 1,
    y: point.y,
    color: wColor,
  };

  const neighbors = [];
  neighbors.push(south, east);

  if (point.x > 0) neighbors.push(west);

  return neighbors;
};

const evaluatePointNeighbors = (point) => {
  var results = [];

  const neighbors = buildNeighbors(point);

  for (var i = 0; i < neighbors.length; i++) {
    if (checkPoint(neighbors[i])) results.push(neighbors[i]);
  }

  return results;
};

const getResults = () => {
  var results = [];
  var toCheck = [];

  const point = {
    x: 0,
    y: 0,
    color: sColor,
  };

  var curPoint = point;

  results.push(point);
  toCheck.push(point);

  var maxDepth = 1000;
  var curDepth = 0;

  while (toCheck.length > 0 && curDepth < maxDepth) {
    curDepth++;
    curPoint = toCheck[0];
    const branch = evaluatePointNeighbors(curPoint);

    results.push(...branch);
    toCheck.push(...branch);

    toCheck.splice(toCheck.indexOf(curPoint), 1);
  }

  if (results.length < 50) return getResults();

  return results;
};

const getImageData = () => {
  var results = getResults();
  var imageDataArray = [];

  maxX =
    Math.max.apply(
      Math,
      results.map(function (i) {
        return i.x;
      })
    ) + 1;
  minY =
    Math.min.apply(
      Math,
      results.map(function (i) {
        return i.y;
      })
    ) - 1;

  for (var y = 0; y > minY; y--) {
    for (var x = 0; x < maxX; x++) {
      const result = results.filter((r) => r.x === x && r.y === y)[0];
      if (result) {
        imageDataArray.push(...result.color);
      } else {
        imageDataArray.push(...noColor);
      }
    }
  }

  return createImageData(
    new Uint8ClampedArray(imageDataArray),
    maxX,
    Math.abs(minY)
  );
};

const generateImage = () => {
  const tempCanvas = createCanvas(200, 200);
  const tempContext = tempCanvas.getContext("2d");

  const imgData = getImageData();

  tempContext.putImageData(imgData, 0, 0);

  const canvas = createCanvas(200, 200);
  const context = canvas.getContext("2d");
  context.drawImage(tempCanvas, 0, 0, maxX, Math.abs(minY), 0, 0, 200, 200);

  return canvas;
};

module.exports = { generateImage };
