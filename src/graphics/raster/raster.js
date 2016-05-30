class Color {
  constructor([r, g, b, a]) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  equalTo(otherColor) {
    return this.r === otherColor.r &&
      this.g === otherColor.g &&
      this.b === otherColor.b &&
      this.a === otherColor.a;
  }

  toRGBA() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

class Raster {
  constructor(imageData) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
    this.data = imageData.data;
  }

  getColor(x, y) {
    const startIndex = y * this.width * 4 + x * 4;
    return new Color(this.imageData.data.slice(startIndex, startIndex + 4));
  }

  setColor(x, y, color) {
    const startIndex = y * this.width * 4 + x * 4;
    const data = this.data;
    data[startIndex] = color.r;
    data[startIndex + 1] = color.g;
    data[startIndex + 2] = color.b;
    data[startIndex + 3] = color.a;
  }

  drawPoints(points, color) {
    points.forEach(point => this.setColor(point.x, point.y, color));
  }
}

export { Color, Raster };
export default Raster;
