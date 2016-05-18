import MapView from "./map";
import {setColor, detectRegion} from "./flood-fill";
import mapImage from "url?!../assets/giz2-map-white.png";
import PointIndex from "./point-index";

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
    const minX = shape.reduce((min, point) => Math.min(min, point.x), canvas.width);
    const minY = shape.reduce((min, point) => Math.min(min, point.y), canvas.height);

    // outline
    // console.table(shape);
    const pointIndex = new PointIndex();
    shape.forEach((point) => pointIndex.addPoint(point));

    const isPointOnMargin = (point) => {
      const {x, y} = point;
      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          if (!pointIndex.hasPoint({x: x + dx, y: y + dy})) {
            return true;
          }
        }
      }
      return false;
    };

    const raionCtx = raionViewCanvas.getContext('2d');
    raionCtx.fillRect(0, 0, raionViewCanvas.width, raionViewCanvas.height);
    const raionImageData = raionCtx.getImageData(0, 0, raionViewCanvas.width, raionViewCanvas.height);
    const shapeOutline = shape.filter(isPointOnMargin);
    console.table(shapeOutline);
    const translatedShape = shapeOutline.map((point) => ({
      x: point.x - minX + raionViewCanvas.width / 2,
      y: point.y - minY + raionViewCanvas.height / 2
    }));
    translatedShape.forEach((point) => setColor(raionImageData, point.x, point.y, [0, 196, 64, 255]));
    raionCtx.putImageData(raionImageData, 0, 0);

  };
}

document.onload = init();
