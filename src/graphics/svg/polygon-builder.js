const listPointsAsString = (points) =>
  points.listPoints()
    .map(point => `${point.x},${point.y}`).join(' ');

export default function buildPolygon(points) {
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', listPointsAsString(points));
  return polygon;
}

export function buildPolygonString(points) {
  return `<polygon points="${listPointsAsString(points)}"/>`;
}
