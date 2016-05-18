var MapView = function (canvas, projector, background) {
  this.g = canvas.getContext('2d');
  this.width = canvas.width;
  this.height = canvas.height;
  this.projector = projector;
  this.model = {points: []};
  // initialize background
  var backgroundImage = new Image();
  backgroundImage.onload = this.renderBackground.bind(this, backgroundImage);
  backgroundImage.src = background;
  this.backgroundReady = false;
};

MapView.prototype.renderBackground = function (backgroundImage) {
  this.g.save();
  // this.g.translate(this.width / 2, this.height / 2);
  // this.g.rotate(Math.PI * 2 / 180);
  // this.g.translate(-this.width / 2, -this.height / 2);
  // this.g.translate(0, -30);
  this.g.drawImage(backgroundImage, 0, 0);
  this.g.restore();
  this.backgroundReady = true;
  this.render();
};

MapView.prototype.updateModel = function (model) {
  this.model = model;
  this.render();
};

MapView.prototype.renderPoint = function (geoPoint) {
  var point = this.projector.project(geoPoint);
  this.g.save();
  this.g.strokeStyle = 'red';
  this.g.fillStyle = 'red';
  this.g.rect(point.x, point.y, 3, 3);
  this.g.stroke();
  this.g.fill();
  this.g.restore();
};

MapView.prototype.render = function () {
  if (this.backgroundReady) {
    this.model.points.forEach(this.renderPoint.bind(this));
  }
};

export default MapView;
