export default function buildPolygon(points) {
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', points.map(point => `${point.x},${point.y}`).join(' '));
  return polygon;
}

export function buildPolygonString(points) {
  const pointList = points.map(point => `${point.x},${point.y}`).join(' ');
  return `<polygon points="${pointList}"/>`

}
