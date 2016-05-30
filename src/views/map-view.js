import { setColor } from '../graphics/raster/flood-fill';

export default class MapView {

  constructor(canvas, background) {
    this.g = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    // initialize background
    this.backgroundImage = new Image();
    this.backgroundImage.onload = () => this.render();
    this.backgroundImage.src = background;
  }

  highlightRegion(shape, color = [255, 255, 0, 255]) {
    this.overlay = { shape, color };
    this.render();
  }

  render() {
    this.g.drawImage(this.backgroundImage, 0, 0);
    if (this.overlay) {
      const imageData = this.g.getImageData(0, 0, this.width, this.height);
      this.overlay.shape.forEach(point =>
        setColor(imageData, point.x, point.y, this.overlay.color));
      this.g.putImageData(imageData, 0, 0);
    }
  }
}
