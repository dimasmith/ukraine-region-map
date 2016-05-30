import './sass/editor.scss';
import MapView from './views/map-view';
import MappingView from './views/mapping-view';
import { Raster, Color } from './graphics/raster/raster';
import { trackArea, trackOutline, trackPath } from './graphics/raster/tracking';
import buildPolygon, { buildPolygonString } from './graphics/svg/polygon-builder';
import { sendDistrict, fetchRegions } from './rest';
// those imports will be replaced with configurable assets later on
import atu from 'json!../examples/ukraine/regions.json';
import mapImage from 'url?!../examples/ukraine/detailed-map.png';

function init() {
  const canvas = document.getElementById('map');
  const debugCanvas = document.querySelector('.debug__canvas');
  const progressMap = document.getElementById('progress');
  progressMap.style.backgroundImage = `url(${mapImage})`;

  const mapView = new MapView(canvas, mapImage);
  const mappingView = new MappingView(atu);

  mapView.render();
  mappingView.render();

  fetchRegions().then(response => {
    response.json().then(mappedDistricts => {
      progressMap.innerHTML = mappedDistricts
        .map(entry => entry.polygon)
        .reduce((source, polygon) => source + polygon);
    });
  });

  // region detection
  const g = canvas.getContext('2d');
  canvas.onclick = (evt) => {
    const boundingRectangle = canvas.getBoundingClientRect();
    const imageData = g.getImageData(0, 0, canvas.width, canvas.height);
    const x = evt.clientX - boundingRectangle.left;
    const y = evt.clientY - boundingRectangle.top;
    const raster = new Raster(imageData);
    const areaColor = new Color([255, 255, 255, 255]);
    const area = trackArea(raster, x, y, areaColor);
    if (area.isEmpty()) {
      return;
    }
    mapView.highlightRegion(area);
    // paint district
    const districtCtx = debugCanvas.getContext('2d');
    districtCtx.fillStyle = '#cccccc';
    districtCtx.fillRect(0, 0, debugCanvas.width, debugCanvas.height);
    const shapeOutline = trackOutline(area);
    const path = trackPath(shapeOutline);
    progressMap.appendChild(buildPolygon(path));
    mappingView.onSave((region, district) => {
      if (!path.length) {
        console.error('Please select district before saving');
      }
      const polygonString = buildPolygonString(path);
      sendDistrict({
        key: `${region}/${district}`.toLowerCase(),
        region,
        district,
        polygon: polygonString,
      }).then(() => {
        progressMap.appendChild(buildPolygon(path));
      });
    });
  };
}

document.onload = init();
