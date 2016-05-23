export default class PointIndex {
  constructor(points = []) {
    this.points = {};
    this.indexSize = 0;
    points.forEach((point) => this.addPoint(point));
  }

  addPoint(point) {
    if (this.hasPoint(point)) {
      return;
    }
    const {x, y} = point;
    if (!this.points[x]) {
      this.points[x] = {};
    }
    this.points[x][y] = point;
    this.indexSize++;
  }

  hasPoint(point) {
    const {x, y} = point;
    return this.points[x] !== undefined && this.points[x][y] !== undefined;
  }

  size() {
    return this.indexSize;
  }
}
