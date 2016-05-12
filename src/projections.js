var ImageSize = function(width, height) {
  this.width = width;
  this.height = height;
};

ImageSize.of = function (element) {
  return new ImageSize(element.width, element.height);
};

var GeoBounds = function (leftLon, topLat, rightLon, bottomLat) {
  this.leftLon = leftLon;
  this.topLat = topLat;
  this.rightLon = rightLon;
  this.bottomLat = bottomLat;
};

var Offset = function(left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
};

Offset.ZERO = new Offset(0, 0, 0, 0);

var MillerProjection = function(geoBounds, imageSize, offset) {
  this.geoBounds = geoBounds;
  this.offset = offset || Offset.ZERO;
  this.imageWidth = imageSize.width - this.offset.left - this.offset.right;
  this.imageHeight = imageSize.height - this.offset.top - this.offset.bottom;
};

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function millerX(lon) {
  return toRadians(lon);
}

function millerY(lat) {
  return ((5 / 4) + Math.log(Math.abs(Math.tan((Math.PI / 4) + (2 / 5 * toRadians(lat))))));
}

MillerProjection.prototype.project = function (geoPoint) {
  var bounds = this.geoBounds;
  var x = (millerX(geoPoint.lon) - millerX(bounds.leftLon))
      * (this.imageWidth / (millerX(bounds.rightLon) - millerX(bounds.leftLon)))
      + this.offset.left;
  var y = (millerY(bounds.topLat) - millerY(geoPoint.lat))
      * (this.imageHeight / (millerY(bounds.topLat) - millerY(bounds.bottomLat)))
      + this.offset.top;
  return new Point(x, y);
};