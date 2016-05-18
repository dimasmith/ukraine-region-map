import MapView from './map';
import MerkatorProjection, {GeoBounds, ImageSize, Offset} from './projections';
import {GeoPoint} from './api';
import {isEqualColors, getColor, floodFill} from './flood-fill';
import mapImage from 'url?!../assets/giz2-map-white.png';

var poi = {
  gremyach: new GeoPoint(52.2004, 33.1719),
  foros: new GeoPoint(44.2311, 33.4638),
  solomonovo: new GeoPoint(48.2250, 22.0950),
  rannyaZorya: new GeoPoint(49.1533, 40.1153),
  kyiv: new GeoPoint(50.2700, 30.3124),
  lviv: new GeoPoint(49.4948, 24.0051),
  odesa: new GeoPoint(46.2906, 30.4436),
  kharkiv: new GeoPoint(50.0021, 36.1345)
};

function posterize(canvas) {
  var g = canvas.getContext('2d');
  var imageData = g.getImageData(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i] == 255 && imageData.data[i + 1] == 255 && imageData.data[i + 2] == 255 && imageData.data[i + 3] == 255) {
      imageData.data[i] = 0;
      imageData.data[i + 1] = 255;
      imageData.data[i + 2] = 0;
      imageData.data[i + 3] = 255;
    }
  }
  g.putImageData(imageData, 0, 0);
}

function randomColor() {
  return [
    Math.floor(Math.random() * 196),
    Math.floor(Math.random() * 196),
    Math.floor(Math.random() * 196), 255];
}

function init() {

  const canvas = document.createElement('canvas');
  canvas.width = 982;
  canvas.height = 673;
  document.body.appendChild(canvas);
  var projector = new MerkatorProjection(
    new GeoBounds(poi.solomonovo.lon, poi.gremyach.lat, poi.rannyaZorya.lon, poi.foros.lat),
    new ImageSize.of(canvas),
    new Offset(17, 22, 13, 18));
  var projectionView = new MapView(canvas, projector, mapImage);
  projectionView.render();
  var g = canvas.getContext('2d');
  canvas.onclick = function (evt) {
    var threshold = 48;
    var counter = 0;
    var imageData = g.getImageData(0, 0, canvas.width, canvas.height);
    console.time('paint-regions');
    // floodFill(imageData, evt.layerX, evt.layerY, [255, 255, 255, 255], randomColor(), g)
    for (var x = 0; x < imageData.width; x++) {
      for (var y = 0; y < imageData.height; y++) {
        if (isEqualColors(getColor(imageData, x, y), [255, 255, 255, 255])) {
          var filled = floodFill(imageData, x, y, [255, 255, 255, 255], [0, 255, 64, 255], g);
          if (filled > threshold) {
            counter++;
            // console.log('Raion added', counter);
          } else {
            // console.log('Skip due to small size', filled);
          }
        }
      }
    }
    g.putImageData(imageData, 0, 0);
    console.log('Regions found', counter);
    console.timeEnd('paint-regions');
  };

  window.posterize = posterize.bind(this, canvas);
}

document.onload = init();
