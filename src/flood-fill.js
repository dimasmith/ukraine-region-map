export function isEqualColors(color, otherColor) {
  for (var i = 0; i < 4; i++) {
    if (color[i] != otherColor[i]) {
      return false;
    }
  }
  return true;
}

function toRGBA(rasterData) {
  return 'rgba(' + rasterData.join(',') + ')';
}

export function getColor(imageData, x, y) {
  var startIndex = y * imageData.width * 4 + x * 4;
  return [imageData.data[startIndex],
    imageData.data[startIndex + 1],
    imageData.data[startIndex + 2],
    imageData.data[startIndex + 3]];
}

export function setColor(imageData, x, y, color) {
  var startIndex = y * imageData.width * 4 + x * 4;
  for (var i = 0; i < 4; i++) {
    imageData.data[startIndex + i] = color[i];
  }
}

export function floodFill(imageData, x, y, replacedColor, targetColor) {
  var filledPixelsCount = 0;
  var pixelQueue = [];
  var color = getColor(imageData, x, y);
  if (!isEqualColors(color, replacedColor)) {
    return filledPixelsCount;
  }
  pixelQueue.push({x: x, y: y});
  while (pixelQueue.length > 0) {
    var n = pixelQueue.shift();
    if (!isEqualColors(getColor(imageData, n.x, n.y), replacedColor)) {
      continue;
    }
    var west = {x: n.x, y: n.y};
    var east = {x: n.x, y: n.y};
    while (isEqualColors(getColor(imageData, west.x, west.y), replacedColor)) {
      west = {x: west.x - 1, y: west.y};
    }
    while (isEqualColors(getColor(imageData, east.x, east.y), replacedColor)) {
      east = {x: east.x + 1, y: east.y};
    }

    // var startX = Math.max(0, west.x);
    // var endX = Math.min(imageData.width, east.x);
    var startX = west.x;
    var endX = east.x;
    for (var j = startX + 1; j < endX; j++) {
      setColor(imageData, j, n.y, targetColor);
    }

    for (var i = startX; i < endX; i++) {
      var north = {x: i, y: n.y - 1};
      var south = {x: i, y: n.y + 1};
      if (isEqualColors(getColor(imageData, north.x, north.y), replacedColor) && north.y >= 0) {
        pixelQueue.push(north);
        filledPixelsCount++;
      }
      if (isEqualColors(getColor(imageData, south.x, south.y), replacedColor) && south.y < imageData.height) {
        pixelQueue.push(south);
        filledPixelsCount++;
      }
    }
  }
  // g.putImageData(imageData, 0, 0);
  return filledPixelsCount;
}
