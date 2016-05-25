import './editor.scss';
import MapView from "./map";
import {setColor, detectRegion} from "./flood-fill";
import mapImage from "url?!../assets/giz2-map-white.png";
import PointIndex from "./point-index";
import trackPath, {outline} from "./path-tracker";
import buildPolygon, {buildPolygonString} from './polygon-builder';
import {loadRegions, storeRegion} from './storage-browser';
import atu from 'json!./atu.json';

const createOptionElement = (value) => {
  const option = document.createElement('option');
  option.value = value;
  option.text = value;
  return option;
};

const removeAllChildElements = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

let path = [];

class PropertiesView {
  constructor(props) {
    this.onPropertiesChange(props);
    this.onStateChange({});
  }

  onPropertiesChange(props) {
    this.props = props;
  }

  onStateChange(state) {
    this.state = state;
  }

  updateState(newState) {
    this.onStateChange(newState);
    this.render();
  }

  updateProperties(props) {
    this.onPropertiesChange(props);
    this.render();
  }

  render() {
    const regions = this.props.map(region => region.region).sort();
    const selectedRegion = this.state.region || regions[0];
    const districts = this.props.find(region => region.region === selectedRegion).districts.sort();

    const $region = document.querySelector('.properties__region');
    const $district = document.querySelector('.properties__district');
    const $saveButton = document.querySelector('.properties__save-button');
    const $regionOptions = regions.map(region => createOptionElement(region));
    $regionOptions.forEach(option => $region.appendChild(option));
    const $districtOptions = districts.map(district => createOptionElement(district));
    $districtOptions.forEach(district => $district.appendChild(district));

    $region.onchange = (value) => {
      removeAllChildElements($district);
      this.updateState({region: $region.value});
    };

    $saveButton.onclick = () => {
      storeRegion($region.value, $district.value, buildPolygonString(path))
    }
  }
}

const createElementFromString = (string) => {
  const wrapper = document.createElement('svg');
  wrapper.innerHTML = string;
  return wrapper.firstChild;
};

function init() {
  const canvas = document.getElementById('map');
  const debugCanvas = document.querySelector('.debug__canvas');
  const svg = document.getElementById('progress');

  const mapView = new MapView(canvas, mapImage);
  const propertiesView = new PropertiesView(atu);

  mapView.render();
  propertiesView.render();

  const mappedRegions = loadRegions();
  mappedRegions.map(entry => entry.polygon)
    .forEach(polygon => svg.appendChild(createElementFromString(polygon)));

  // region detection
  const g = canvas.getContext('2d');
  canvas.onclick = function (evt) {
    const boundingRectangle = canvas.getBoundingClientRect();
    var imageData = g.getImageData(0, 0, canvas.width, canvas.height);
    const area = detectRegion(imageData, evt.clientX - boundingRectangle.left, evt.clientY - boundingRectangle.top, [255, 255, 255, 255]);
    if (area.length === 0) {
      return;
    }
    mapView.highlightRegion(area);
    // paint district
    const districtCtx = debugCanvas.getContext('2d');
    districtCtx.fillStyle = '#cccccc';
    districtCtx.fillRect(0, 0, debugCanvas.width, debugCanvas.height);
    const shapeOutline = outline(area);

    path = trackPath(new PointIndex(shapeOutline));
    const polygon = buildPolygon(path);
    svg.appendChild(polygon);

    // const minX = area.reduce((min, point) => Math.min(min, point.x), canvas.width);
    // const minY = area.reduce((min, point) => Math.min(min, point.y), canvas.height);
    // const translatedOutline = shapeOutline.map((point) => ({
    //   x: point.x - minX + debugCanvas.width / 4,
    //   y: point.y - minY + debugCanvas.height / 4
    // }));
    // const translatedArea = area.map((point) => ({
    //   x: point.x - minX + debugCanvas.width / 4,
    //   y: point.y - minY + debugCanvas.height / 4
    // }));
    // const debugImageData = districtCtx.getImageData(0, 0, debugCanvas.width, debugCanvas.height);
    // translatedArea.forEach((point) => setColor(debugImageData, point.x, point.y, [255, 255, 0, 255]));
    // districtCtx.putImageData(debugImageData, 0, 0);

    // const outlineIndex = new PointIndex(translatedOutline);
    // const translatedPath = trackPath(outlineIndex);
    // translatedOutline.forEach((point) => setColor(debugImageData, point.x, point.y, [255, 0, 0, 255]));
    // districtCtx.putImageData(debugImageData, 0, 0);
    // debugPaint(debugImageData, translatedPath, () => districtCtx.putImageData(debugImageData, 0, 0), 10);
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
