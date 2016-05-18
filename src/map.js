export default class MapView {

 constructor(canvas, background) {
    this.g = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.model = {points: []};
    // initialize background
    var backgroundImage = new Image();
    backgroundImage.onload = this.renderBackground.bind(this, backgroundImage);
    backgroundImage.src = background;
    this.backgroundReady = false;
  }

  renderBackground(backgroundImage) {
    this.g.save();
    this.g.drawImage(backgroundImage, 0, 0);
    this.g.restore();
    this.backgroundReady = true;
    this.render();
  };

  render() {

  };
}
