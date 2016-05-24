export default class PointIndex {
  constructor(points = []) {
    this.points = {};
    this.pointList = [];
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
    this.pointList.push(point);
  }

  hasPoint(point) {
    const {x, y} = point;
    return this.points[x] !== undefined && this.points[x][y] !== undefined;
  }
  
  listPoints() {
    return this.pointList;
  }

  size() {
    return this.pointList.length;
  }
}
