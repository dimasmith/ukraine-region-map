var MapView = function (g) {
  this.g = g;
  // initialize background
  var backgroundImage = new Image();
  backgroundImage.onload = this.renderBackground.bind(this, backgroundImage);
  backgroundImage.src = 'assets/giz2-map-transparent.png';
};

MapView.prototype.renderBackground = function (backgroundImage) {
  this.g.drawImage(backgroundImage, 0, 0);
};

MapView.prototype.render = function() {

};

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function interpolate(value, range, targetRange, offset) {
  var offset = offset || 0;
  return targetRange / range * value + offset;
}

function millerX(lon) {
  return toRadians(lon);
}

function millerY(lat) {
  return ((5 / 4) + Math.log(Math.abs(Math.tan((Math.PI / 4) + (2 / 5 * toRadians(lat))))));
}

function millerProjection(geoPoint, leftLon, topLat, rightLon, bottomLat, imageWidth, imageHeight) {
  var x = (millerX(geoPoint.lon) - millerX(leftLon)) * (imageWidth / (millerX(rightLon) - millerX(leftLon)));
  var y = (millerY(topLat) - millerY(geoPoint.lat)) * (imageHeight / (millerY(topLat) - millerY(bottomLat)));
  return new Point(x, y);
}

var CylindricalProjectionView = function(canvas) {
  this.g = canvas.getContext('2d');
  this.width = canvas.width;
  this.height = canvas.height;
};

CylindricalProjectionView.prototype.updateModel = function (model) {
  this.render(model);
};

CylindricalProjectionView.prototype.projectPoint = function (geoPoint) {
  return millerProjection(geoPoint, 20, 60, 45, 40, this.width, this.height);
};

CylindricalProjectionView.prototype.renderPoint = function (geoPoint) {
  var point = this.projectPoint(geoPoint);
  this.g.rect(point.x, point.y, 1, 1);
  this.g.stroke();
  this.g.fill();
};

CylindricalProjectionView.prototype.render = function (model) {
  model.points.forEach(this.renderPoint.bind(this));
};

var GeoPoint = function(lat, lon) {
  this.lat = lat;
  this.lon = lon;
};

var Point = function (x, y) {
  this.x = x;
  this.y = y;
};

var poi = {
  gremyach: new GeoPoint(52.2004, 33.1219),
  foros: new GeoPoint(44.2311, 33.4638),
  solomonovo: new GeoPoint(48.2250, 22.0950),
  rannyaZorya: new GeoPoint(49.1533, 40.1153)
};

function init() {
  var canvas = document.getElementById('map');
  // var g = canvas.getContext('2d');

  var projectionView = new CylindricalProjectionView(canvas);
  projectionView.updateModel({points:
      [poi.gremyach, poi.foros, poi.solomonovo, poi.rannyaZorya]
  });

  // console.log(millerProjection(poi.gremyach));

}

document.onload = init();