/**
 * Contains set of points. Quickly checks for point presence.
 * Points keep order in which it was added.
 */
class Points {
  constructor(points = []) {
    this.points = {};
    this.pointList = [];
    points.forEach((point) => this.addPointIfNotPresent(point));
  }

  addPointIfNotPresent(point) {
    if (this.hasPoint(point)) {
      return;
    }
    const { x, y } = point;
    if (!this.points[x]) {
      this.points[x] = {};
    }
    this.points[x][y] = point;
    this.pointList.push(point);
  }

  hasPoint(point) {
    const { x, y } = point;
    return this.points[x] !== undefined && this.points[x][y] !== undefined;
  }

  listPoints() {
    return this.pointList;
  }

  size() {
    return this.pointList.length;
  }

  filter(predicate) {
    return new Points(this.pointList.filter(predicate));
  }

  forEach(consumer) {
    this.pointList.forEach(consumer);
  }

  isEmpty() {
    return this.pointList.length === 0;
  }
}

export default Points;
