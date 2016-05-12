var MapView = function (g, projector) {
  this.g = g;
  this.projector = projector;
  this.model = {points: []};
  // initialize background
  var backgroundImage = new Image();
  backgroundImage.onload = this.renderBackground.bind(this, backgroundImage);
  backgroundImage.src = 'assets/giz2-map-transparent.png';
};

MapView.prototype.renderBackground = function (backgroundImage) {
  this.g.drawImage(backgroundImage, 0, 0);
  this.render();
};

MapView.prototype.updateModel = function (model) {
  this.model = model;
  this.render();
};

MapView.prototype.renderPoint = function (geoPoint) {
  var point = this.projector.project(geoPoint);
  this.g.strokeStyle = 'red';
  this.g.fillStyle = 'red';
  this.g.rect(point.x, point.y, 3, 3);
  this.g.stroke();
  this.g.fill();
};

MapView.prototype.render = function () {
  this.model.points.forEach(this.renderPoint.bind(this));
};
