export const ImageSize = function (width, height) {
  this.width = width;
  this.height = height;
};

ImageSize.of = function (element) {
  return new ImageSize(element.width, element.height);
};

export const GeoBounds = function (leftLon, topLat, rightLon, bottomLat) {
  this.leftLon = leftLon;
  this.topLat = topLat;
  this.rightLon = rightLon;
  this.bottomLat = bottomLat;
};

export const Offset = function (left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
};

Offset.ZERO = new Offset(0, 0, 0, 0);

var MillerProjection = function (geoBounds, imageSize, offset) {
  this.offset = offset || Offset.ZERO;
  this.imageWidth = imageSize.width - this.offset.left - this.offset.right;
  this.imageHeight = imageSize.height - this.offset.top - this.offset.bottom;
  this.projectedLeftLonBound = MillerProjection.projectX(geoBounds.leftLon);
  this.projectedTopLatBound = MillerProjection.projectY(geoBounds.topLat);
  this.projectedXRatio = (this.imageWidth / (MillerProjection.projectX(geoBounds.rightLon) - this.projectedLeftLonBound));
  this.projectedYRatio = (this.imageHeight / (this.projectedTopLatBound - MillerProjection.projectY(geoBounds.bottomLat)));
};

MillerProjection.toRadians = function (deg) {
  return deg * Math.PI / 180;
};

MillerProjection.projectX = function (lon) {
  return MillerProjection.toRadians(lon);
};

MillerProjection.projectY = function (lat) {
  return 1.25 + Math.log(Math.abs(Math.tan((Math.PI / 4) + (0.4 * MillerProjection.toRadians(lat)))));
};

MillerProjection.prototype.project = function (geoPoint) {
  var x = (MillerProjection.projectX(geoPoint.lon) - this.projectedLeftLonBound) * this.projectedXRatio + this.offset.left;
  var y = (this.projectedTopLatBound - MillerProjection.projectY(geoPoint.lat)) * this.projectedYRatio + this.offset.top;
  return new Point(x, y);
};

var MerkatorProjection = function (geoBounds, imageSize, offset) {
  this.offset = offset || Offset.ZERO;
  this.imageWidth = imageSize.width - this.offset.left - this.offset.right;
  this.imageHeight = imageSize.height - this.offset.top - this.offset.bottom;
  this.projectedLeftLonBound = MerkatorProjection.projectX(geoBounds.leftLon);
  this.projectedTopLatBound = MerkatorProjection.projectY(geoBounds.topLat);
  this.projectedXRatio = (this.imageWidth / (MerkatorProjection.projectX(geoBounds.rightLon) - this.projectedLeftLonBound));
  this.projectedYRatio = (this.imageHeight / (this.projectedTopLatBound - MerkatorProjection.projectY(geoBounds.bottomLat)));
};

MerkatorProjection.toRadians = function (deg) {
  return deg * Math.PI / 180;
};

MerkatorProjection.projectX = function (lon) {
  return MerkatorProjection.toRadians(lon);
};

MerkatorProjection.projectY = function (lat) {
  return Math.log(Math.abs(Math.tan((Math.PI / 4) + (0.5 * MerkatorProjection.toRadians(lat)))));
};

MerkatorProjection.prototype.project = function (geoPoint) {
  var x = (MerkatorProjection.projectX(geoPoint.lon) - this.projectedLeftLonBound) * this.projectedXRatio + this.offset.left;
  var y = (this.projectedTopLatBound - MerkatorProjection.projectY(geoPoint.lat)) * this.projectedYRatio + this.offset.top;
  return new Point(x, y);
};

export default MerkatorProjection;
