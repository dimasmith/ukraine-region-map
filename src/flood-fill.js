function isEqualColors(color, otherColor) {
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

function getColor(g, x, y) {
  return g.getImageData(x, y, 1, 1).data;
}

function floodFill(g, x, y, replacedColor, targetColor, width, height) {
  g.save();
  g.strokeStyle = toRGBA(targetColor);
  g.lineWidth = 1;
  var filledPixelsCount = 0;
  var pixelQueue = [];
  var color = getColor(g, x, y);
  if (!isEqualColors(color, replacedColor)) {
    g.restore();
    return filledPixelsCount;
  }
  pixelQueue.push({x: x, y: y});
  while (pixelQueue.length > 0) {
    var n = pixelQueue.shift();
    if (isEqualColors(getColor(g, n.x, n.y), replacedColor)) {
      var w = n;
      var e = n;
      while (isEqualColors(getColor(g, w.x, w.y), replacedColor)) {
        w = {x: w.x - 1, y: w.y};
      }
      while (isEqualColors(getColor(g, e.x, e.y), replacedColor)) {
        e = {x: e.x + 1, y: e.y};
      }

      var startX = Math.max(0, w.x);
      var endX = Math.min(width, e.x);
      var line = g.getImageData(startX, n.y, endX - startX, 1);
      for (var i = 0; i < line.data.length; i += 4) {
        line.data[i] = targetColor[0];
        line.data[i + 1] = targetColor[1];
        line.data[i + 2] = targetColor[2];
        line.data[i + 3] = targetColor[3];
      }
      g.putImageData(line, startX, n.y);

      for (var i = Math.max(0, w.x); i < endX; i++) {
        var north = {x: i, y: n.y - 1};
        var south = {x: i, y: n.y + 1};
        if (isEqualColors(getColor(g, north.x, north.y), replacedColor) && north.y >= 0) {
          pixelQueue.push(north);
          filledPixelsCount++;
        }
        if (isEqualColors(getColor(g, south.x, south.y), replacedColor) && south.y < height) {
          pixelQueue.push(south);
          filledPixelsCount++;
        }
      }
    }
  }
  g.restore();
  return filledPixelsCount;
}
