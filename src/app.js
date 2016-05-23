import MapView from "./map";
import {setColor, detectRegion} from "./flood-fill";
import mapImage from "url?!../assets/giz2-map-white.png";
import PointIndex from "./point-index";

function init() {
  const zoomDebugCanvas = document.createElement('canvas');
  zoomDebugCanvas.width = 400;
  zoomDebugCanvas.height = 400;
  // document.querySelector('body').appendChild(zoomDebugCanvas);

  const districtViewCanvas = document.createElement('canvas');
  districtViewCanvas.width = 100;
  districtViewCanvas.height = 100;

  const canvas = document.createElement('canvas');
  canvas.width = 982;
  canvas.height = 673;

  document.querySelector('body').appendChild(canvas);
  document.querySelector('body').appendChild(districtViewCanvas);

  var mapView = new MapView(canvas, mapImage);
  mapView.render();

  // region detection
  var g = canvas.getContext('2d');
  canvas.onclick = function (evt) {
    var imageData = g.getImageData(0, 0, canvas.width, canvas.height);
    const area = detectRegion(imageData, evt.clientX, evt.clientY, [255, 255, 255, 255]);
    // paint district
    const minX = area.reduce((min, point) => Math.min(min, point.x), canvas.width);
    const minY = area.reduce((min, point) => Math.min(min, point.y), canvas.height);

    // outline
    // console.table(shape);
    const areaPointIndex = new PointIndex();
    area.forEach((point) => areaPointIndex.addPoint(point));

    // Neighbor points
    const NW = {dx: -1, dy: -1};
    const N = {dx: 0, dy: -1};
    const NE = {dx: 1, dy: -1};
    const E = {dx: 1, dy: 0};
    const SE = {dx: 1, dy: 1};
    const S = {dx: 0, dy: 1};
    const SW = {dx: -1, dy: 1};
    const W = {dx: -1, dy: 0};
    const CCW = [N, NE, E, SE, S, SW, W, NW];
    const neighborOn = (point, direction) => ({x: point.x + direction.dx, y: point.y + direction.dy});

    const isPointOnMargin = (point) => {
      return CCW.map((direction) => neighborOn(point, direction))
        .some((point) => !areaPointIndex.hasPoint(point));
    };

    const districtCtx = districtViewCanvas.getContext('2d');
    districtCtx.fillStyle = '#cccccc';
    districtCtx.fillRect(0, 0, districtViewCanvas.width, districtViewCanvas.height);
    const shapeOutline = area.filter(isPointOnMargin);

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
    const visitedIndex = new PointIndex();
    const startingPoint = translatedOutline[0];
    const pointList = [];
    pointList.push(startingPoint);
    let previousPoint = startingPoint;
    for (let i = 0; i < translatedOutline.length; i++) {
      if (!previousPoint) {
        break;
      }
      visitedIndex.addPoint(previousPoint);
      let nextDirection = CCW.find((direction) => {
        const neighborPoint = neighborOn(previousPoint, direction);
        return outlineIndex.hasPoint(neighborPoint) && !visitedIndex.hasPoint(neighborPoint);
      });
      if (!nextDirection) {
        break;
      }
      let nextPoint = neighborOn(previousPoint, nextDirection);
      pointList.push(nextPoint);
      previousPoint = nextPoint;
    }

    translatedOutline.forEach((point) => setColor(districtImageData, point.x, point.y, [255, 0, 0, 255]));
    districtCtx.putImageData(districtImageData, 0, 0);
    debugPaint(districtImageData, pointList, () => districtCtx.putImageData(districtImageData, 0, 0), 100);

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
