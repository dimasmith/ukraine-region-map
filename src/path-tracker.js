import PointIndex from "./point-index";

export const NW = { dx: -1, dy: -1, direction: 'NW' };
export const N = { dx: 0, dy: -1, direction: 'N' };
export const NE = { dx: 1, dy: -1, direction: 'NE' };
export const E = { dx: 1, dy: 0, direction: 'E' };
export const SE = { dx: 1, dy: 1, direction: 'SE' };
export const S = { dx: 0, dy: 1, direction: 'S' };
export const SW = { dx: -1, dy: 1, direction: 'SW' };
export const W = { dx: -1, dy: 0, direction: 'W' };
export const CCW = [N, NE, E, SE, S, SW, W, NW];

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

export default function trackPath(shapeOutline, startingPoint = findStartingPoint(shapeOutline)) {
  const trackedPoints = new PointIndex();
  const path = [startingPoint];
  try {
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
  } catch (e) {
    console.error(e);
  }
  return path;
}

const isPointOnMargin = (areaPointIndex) => (point) =>
  [N, E, S, W].map((direction) => neighborOn(point, direction))
    .some((p) => !areaPointIndex.hasPoint(p));


/**
 * Find all points on outline of area.
 * @param area array of all shape points.
 */
export function outline(area) {
  const areaPointIndex = new PointIndex(area);
  return area.filter(isPointOnMargin(areaPointIndex));
}
