import MapView from './map';
import {GeoPoint} from './api';
import {isEqualColors, getColor, floodFill, setColor, detectRegion} from './flood-fill';
import mapImage from 'url?!../assets/giz2-map-white.png';

function init() {

  const canvas = document.createElement('canvas');
  canvas.width = 982;
  canvas.height = 673;
  document.querySelector('body').appendChild(canvas);

  const raionViewCanvas = document.createElement('canvas');
  raionViewCanvas.width = 200;
  raionViewCanvas.height = 200;
  document.querySelector('body').appendChild(raionViewCanvas);

  var mapView = new MapView(canvas, mapImage);
  mapView.render();

  // region detection
  var g = canvas.getContext('2d');
  canvas.onclick = function (evt) {
    var imageData = g.getImageData(0, 0, canvas.width, canvas.height);
    const shape = detectRegion(imageData, evt.layerX, evt.layerY, [255, 255, 255, 255]);
    // paint raion
    // const minX = shape.reduce((min, point) => Math.min(min, point.x), canvas.width);
    // const minY = shape.reduce((min, point) => Math.min(min, point.y), canvas.height);
    // console.log(minX, minY);
    const minX = 394;
    const minY = 97;

    const raionCtx = raionViewCanvas.getContext('2d');
    // raionCtx.fillStyle = '#face8d';
    // raionCtx.fillRect(0, 0, raionViewCanvas.width, raionViewCanvas.height);
    const raionImageData = raionCtx.getImageData(0, 0, raionViewCanvas.width, raionViewCanvas.height);
    const translatedShape = shape.map((point) => ({x: point.x - minX, y: point.y - minY}));
    translatedShape.forEach((point) => setColor(raionImageData, point.x, point.y, [0, 196, 64, 255]));
    raionCtx.putImageData(raionImageData, 0, 0);
  };
}

document.onload = init();
