import "./editor.scss";
import MapView from "./map";
import { detectRegion } from "./flood-fill";
import PointIndex from "./point-index";
import trackPath, { outline } from "./path-tracker";
import buildPolygon, { buildPolygonString } from "./polygon-builder";
import { sendDistrict, fetchRegions } from "./rest";
import atu from "json!./atu.json";
import mapImage from "url?!../assets/giz2-map-white.png";

// Import default assets. Will be replaced by configurable assets in later versions.

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
let progressMap;

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

    $region.onchange = () => {
      removeAllChildElements($district);
      this.updateState({ region: $region.value });
    };

    $saveButton.onclick = () => {
      if (!path.length) {
        console.error('Please select district before saving');
      }

      const polygonString = buildPolygonString(path);
      const region = $region.value;
      const district = $district.value;
      sendDistrict({
        key: `${region}/${district}`.toLowerCase(),
        region,
        district,
        polygon: polygonString,
      }).then(() => {
        progressMap.appendChild(buildPolygon(path));
        path = []; // bad function. bad. side-effects. I will change it
      });
    };
  }
}

function init() {
  const canvas = document.getElementById('map');
  const debugCanvas = document.querySelector('.debug__canvas');
  progressMap = document.getElementById('progress');
  progressMap.style.backgroundImage = `url(${mapImage})`;

  const mapView = new MapView(canvas, mapImage);
  const propertiesView = new PropertiesView(atu);

  mapView.render();
  propertiesView.render();

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
    const area = detectRegion(imageData, x, y, [255, 255, 255, 255]);
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
  };
}

document.onload = init();
