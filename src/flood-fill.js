export function isEqualColors(color, otherColor, tolerance = 0) {
  for (let i = 0; i < 4; i++) {
    const minComp = color[i] - color[i] * (tolerance / 2);
    const maxComp = color[i] + color[i] * (tolerance / 2);
    const colorComp = otherColor[i];
    if (colorComp < minComp || colorComp > maxComp) {
      return false;
    }
  }
  return true;
}

export function getColor(imageData, x, y) {
  const startIndex = y * imageData.width * 4 + x * 4;
  return imageData.data.slice(startIndex, startIndex + 4);
}

export function setColor(imageData, x, y, color) {
  const startIndex = y * imageData.width * 4 + x * 4;
  const data = imageData.data;
  for (let i = 0; i < 4; i++) {
    data[startIndex + i] = color[i];
  }
}

export function floodFill(imageData, x, y, replacedColor, targetColor) {
  let filledPixelsCount = 0;
  const pixelQueue = [];
  const color = getColor(imageData, x, y);
  if (!isEqualColors(color, replacedColor)) {
    return filledPixelsCount;
  }
  pixelQueue.push({ x, y });
  while (pixelQueue.length > 0) {
    const n = pixelQueue.shift();
    if (!isEqualColors(getColor(imageData, n.x, n.y), replacedColor)) {
      continue;
    }
    let west = { x: n.x, y: n.y };
    let east = { x: n.x, y: n.y };
    while (isEqualColors(getColor(imageData, west.x, west.y), replacedColor)) {
      west = { x: west.x - 1, y: west.y };
    }
    while (isEqualColors(getColor(imageData, east.x, east.y), replacedColor)) {
      east = { x: east.x + 1, y: east.y };
    }

    // var startX = Math.max(0, west.x);
    // var endX = Math.min(imageData.width, east.x);
    const startX = west.x;
    const endX = east.x;
    for (let j = startX + 1; j < endX; j++) {
      setColor(imageData, j, n.y, targetColor);
    }

    for (let i = startX; i < endX; i++) {
      const north = { x: i, y: n.y - 1 };
      const south = { x: i, y: n.y + 1 };
      const northColor = getColor(imageData, north.x, north.y);
      if (isEqualColors(northColor, replacedColor) && north.y >= 0) {
        pixelQueue.push(north);
        filledPixelsCount++;
      }

      const southColor = getColor(imageData, south.x, south.y);
      if (isEqualColors(southColor, replacedColor) && south.y < imageData.height) {
        pixelQueue.push(south);
        filledPixelsCount++;
      }
    }
  }
  return filledPixelsCount;
}

export function detectRegion(imageData, x, y, fillColor) {
  const pixelQueue = [];
  const shape = [];
  const points = {};

  const key = (point) => `${point.x};${point.y}`;

  const pointShouldBeFilled = (point) => isEqualColors(
    getColor(imageData, point.x, point.y), fillColor) && !points[key(point)];

  if (!pointShouldBeFilled({ x, y })) {
    return [];
  }
  pixelQueue.push({ x, y });
  while (pixelQueue.length > 0) {
    const n = pixelQueue.shift();
    if (!pointShouldBeFilled(n)) {
      continue;
    }
    let west = { x: n.x, y: n.y };
    let east = { x: n.x, y: n.y };
    while (pointShouldBeFilled(west)) {
      west = { x: west.x - 1, y: west.y };
    }
    while (pointShouldBeFilled(east)) {
      east = { x: east.x + 1, y: east.y };
    }

    const startX = west.x;
    const endX = east.x;
    for (let j = startX + 1; j < endX; j++) {
      const point = { x: j, y: n.y };
      if (!points[key(point)]) {
        points[key(point)] = point;
        shape.push(point);
      }
    }

    for (let i = startX; i < endX; i++) {
      const north = { x: i, y: n.y - 1 };
      const south = { x: i, y: n.y + 1 };
      if (pointShouldBeFilled(north) && north.y >= 0) {
        pixelQueue.push(north);
      }
      if (pointShouldBeFilled(south) && south.y < imageData.height) {
        pixelQueue.push(south);
      }
    }
  }
  return shape;
}
