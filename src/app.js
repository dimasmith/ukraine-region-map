import MapView from "./map";
import {setColor, detectRegion} from "./flood-fill";
import mapImage from "url?!../assets/giz2-map-white.png";
import PointIndex from "./point-index";
import trackPath, {outline} from "./path-tracker";
import buildPolygon, {buildPolygonString} from './polygon-builder';

function init() {
  const districtViewCanvas = document.createElement('canvas');
  districtViewCanvas.width = 100;
  districtViewCanvas.height = 100;

  const canvas = document.createElement('canvas');
  canvas.width = 982;
  canvas.height = 673;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '982');
  svg.setAttribute('height', '673');

  document.querySelector('body').appendChild(canvas);
  document.querySelector('body').appendChild(districtViewCanvas);
  document.querySelector('body').appendChild(svg);


  var mapView = new MapView(canvas, mapImage);
  mapView.render();

  // region detection
  const g = canvas.getContext('2d');
  canvas.onclick = function (evt) {
    const boundingRectangle = canvas.getBoundingClientRect();
    var imageData = g.getImageData(0, 0, canvas.width, canvas.height);
    const area = detectRegion(imageData, evt.clientX - boundingRectangle.left, evt.clientY - boundingRectangle.top, [255, 255, 255, 255]);
    // paint district
    const minX = area.reduce((min, point) => Math.min(min, point.x), canvas.width);
    const minY = area.reduce((min, point) => Math.min(min, point.y), canvas.height);

    const districtCtx = districtViewCanvas.getContext('2d');
    districtCtx.fillStyle = '#cccccc';
    districtCtx.fillRect(0, 0, districtViewCanvas.width, districtViewCanvas.height);
    const shapeOutline = outline(area);

    const translatedOutline = shapeOutline.map((point) => ({
      x: point.x - minX + districtViewCanvas.width / 4,
      y: point.y - minY + districtViewCanvas.height / 4
    }));
    const translatedArea = area.map((point) => ({
      x: point.x - minX + districtViewCanvas.width / 4,
      y: point.y - minY + districtViewCanvas.height / 4
    }));
    const districtImageData = districtCtx.getImageData(0, 0, districtViewCanvas.width, districtViewCanvas.height);
    translatedArea.forEach((point) => setColor(districtImageData, point.x, point.y, [255, 255, 0, 255]));
    districtCtx.putImageData(districtImageData, 0, 0);

    const outlineIndex = new PointIndex(translatedOutline);
    const translatedPath = trackPath(outlineIndex);
    const path = trackPath(new PointIndex(shapeOutline));
    const polygon = buildPolygon(path);
    svg.appendChild(polygon);

    translatedOutline.forEach((point) => setColor(districtImageData, point.x, point.y, [255, 0, 0, 255]));
    districtCtx.putImageData(districtImageData, 0, 0);
    debugPaint(districtImageData, translatedPath, () => districtCtx.putImageData(districtImageData, 0, 0), 10);

  };
}

function debugPaint(imageData, points, repaint, interval = 100, color = [0, 0, 255, 255]) {
  let startTime = null;
  let i = 0;

  function render(timestamp) {
    startTime = startTime || timestamp;
    const progress = timestamp - startTime;
    if (progress > interval) {
      startTime = timestamp;  //resetting progress
      const point = points[i];
      setColor(imageData, point.x, point.y, color);
      repaint();
      i++;
    }
    if (i < points.length) {
      requestAnimationFrame(render);
    }
  }

  requestAnimationFrame(render);
}

document.onload = init();
