export default class PointIndex {
  constructor(points = []) {
    this.points = {};
    points.forEach((point) => this.addPoint(point));
  }

  addPoint(point) {
    const {x, y} = point;
    if (!this.points[x]) {
      this.points[x] = {};
    }
    this.points[x][y] = point;
  }

  hasPoint(point) {
    const {x, y} = point;
    return this.points[x] !== undefined && this.points[x][y] !== undefined;
  }
}
