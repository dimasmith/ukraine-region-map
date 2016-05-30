import Points from './points';

function trackArea(raster, x, y, color) {
  const pixelQueue = [];
  const shape = [];
  const points = {};

  const key = (point) => `${point.x};${point.y}`;

  const pointShouldBeFilled = (point) => raster.getColor(point)
    .equalTo(color) && !points[key(point)];

  if (!pointShouldBeFilled({ x, y })) {
    return new Points();
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
      if (pointShouldBeFilled(south) && south.y < raster.height) {
        pixelQueue.push(south);
      }
    }
  }
  return new Points(shape);
}

const NW = { dx: -1, dy: -1, direction: 'NW' };
const N = { dx: 0, dy: -1, direction: 'N' };
const NE = { dx: 1, dy: -1, direction: 'NE' };
const E = { dx: 1, dy: 0, direction: 'E' };
const SE = { dx: 1, dy: 1, direction: 'SE' };
const S = { dx: 0, dy: 1, direction: 'S' };
const SW = { dx: -1, dy: 1, direction: 'SW' };
const W = { dx: -1, dy: 0, direction: 'W' };
const CCW = [N, NE, E, SE, S, SW, W, NW];

function findOppositeDirection(direction) {
  let oppositeIndex = (CCW.indexOf(direction) + 4);
  if (oppositeIndex > CCW.length) {
    oppositeIndex = oppositeIndex - CCW.length;
  }
  return CCW[oppositeIndex];
}

function ccwStartingOn(direction = W) {
  const startIndex = CCW.indexOf(direction);
  return CCW.slice(startIndex).concat(CCW.slice(0, startIndex));
}

function ccwStartingAfter(direction = SW) {
  if (direction === NW) {
    return CCW;
  }
  const startIndex = CCW.indexOf(direction);
  return ccwStartingOn(CCW[startIndex + 1]);
}

function neighborOn(point, direction) {
  return { x: point.x + direction.dx, y: point.y + direction.dy };
}

function pointsEqual(point, otherPoint) {
  return point.x === otherPoint.x && point.y === otherPoint.y;
}

function findStartingPoint(shapeOutline) {
  return shapeOutline.listPoints().sort((point, otherPoint) => point.x - otherPoint.x)[0];
}

const hasPointOnDirection = (shapeOutline, visitedPoints, point) => (direction) => {
  const neighborPoint = neighborOn(point, direction);
  return shapeOutline.hasPoint(neighborPoint) && !visitedPoints.hasPoint(neighborPoint);
};

function trackPath(shapeOutline, startingPoint = findStartingPoint(shapeOutline)) {
  const trackedPoints = new Points();
  const path = [startingPoint];
  let nextDirection = ccwStartingAfter(W)
    .find(direction => shapeOutline.hasPoint(neighborOn(startingPoint, direction)));
  let nextPoint = neighborOn(startingPoint, nextDirection);
  let previousPointDirection = findOppositeDirection(nextDirection);
  trackedPoints.addPoint(startingPoint);
  while (!pointsEqual(nextPoint, startingPoint) && path.length <= shapeOutline.size()) {
    if (!trackedPoints.hasPoint(nextPoint)) {
      path.push(nextPoint);
    }
    trackedPoints.addPoint(nextPoint);
    nextDirection = ccwStartingAfter(previousPointDirection)
      .find(hasPointOnDirection(shapeOutline, trackedPoints, nextPoint));
    if (nextDirection) {
      nextPoint = neighborOn(nextPoint, nextDirection);
      previousPointDirection = findOppositeDirection(nextDirection);
    } else {
      nextPoint = path[path.indexOf(nextPoint) - 1];
    }
  }
  return new Points(path);
}

const isPointOnMargin = (areaPointIndex) => (point) =>
  [N, E, S, W].map((direction) => neighborOn(point, direction))
    .some((p) => !areaPointIndex.hasPoint(p));


/**
 * Find all points on trackOutline of area.
 * @param area array of all shape points.
 */
function trackOutline(area) {
  return area.filter(isPointOnMargin(area));
}

export { trackArea, trackPath, trackOutline };
