export default class PointIndex {
  constructor() {
    this.points = {};
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
