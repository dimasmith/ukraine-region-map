import './sass/editor.scss';
import MapView from './views/map-view';
import MappingView from './views/mapping-view';
import { Raster, Color } from './graphics/raster/raster';
import { trackArea, trackOutline, trackPath } from './graphics/raster/tracking';
import buildPolygon, { buildPolygonString } from './graphics/svg/polygon-builder';
import { sendDistrict, fetchRegions } from './rest';
// those imports will be replaced with configurable assets later on
import atu from 'json!../examples/ukraine/regions.json';
import mapImage from 'url?!../examples/ukraine/color-map.png';
// import refImage from 'url?!../examples/ukraine/detailed-map.png';

class Remapper {
  constructor(districts) {
    this.districts = districts;
    this.pointer = 0;
    this.nextCallbacks = [];
  }

  onNext(callback) {
    this.nextCallbacks.push(callback);
  }

  next() {
    if (this.pointer < this.districts.length - 1) {
      this.pointer++;
    }
    this.fireUpdate();
  }

  previous() {
    if (this.pointer > 0) {
      this.pointer--;
    }
    this.fireUpdate();
  }

  fireUpdate() {
    this.nextCallbacks.forEach(cb => cb(this.districts[this.pointer]));
  }
}

function init() {
  const canvas = document.getElementById('map');
  const progressMap = document.getElementById('progress');
  // progressMap.style.backgroundImage = `url(${refImage})`;

  const nextButton = document.querySelector('.remap-stats__next-button');
  const previousButton = document.querySelector('.remap-stats__previous-button');
  const mappedNumber = document.querySelector('.remap-stats__number');

  const mapView = new MapView(canvas, mapImage);
  const mappingView = new MappingView(atu);

  mapView.render();
  mappingView.render();

  const g = canvas.getContext('2d');
  const imageData = g.getImageData(0, 0, canvas.width, canvas.height);
  const raster = new Raster(imageData);

  function activateDistrict(x, y, d) {
    if (d && d.region && d.district) {
      mappingView.select(d.region, d.district);
    }
    const areaColor = raster.getColor({ x, y });
    const area = trackArea(raster, x, y, areaColor);
    if (area.isEmpty()) {
      return;
    }
    mapView.highlightRegion(area, new Color([0, 0, 0, 128]));
    // paint district
    const shapeOutline = trackOutline(area);
    const path = trackPath(shapeOutline);
    progressMap.appendChild(buildPolygon(path));
    mappingView.onSave((region, district) => {
      if (path.isEmpty()) {
        console.error('Please select district before saving');
      }
      const polygonString = buildPolygonString(path);
      sendDistrict({
        key: `${region}/${district}`.toLowerCase(),
        region,
        center: { x, y },
        district,
        polygon: polygonString,
      }).then(() => {
        progressMap.appendChild(buildPolygon(path));
      });
    });
  }

  fetchRegions().then(response => {
    response.json().then(mappedDistricts => {
      progressMap.innerHTML = mappedDistricts
        .map(entry => entry.polygon.replace('/>', `><title>${entry.district}</title></polygon>`))
        .reduce((source, polygon) => source + polygon);
      progressMap.innerHTML += mappedDistricts
        .map(entry => `<circle cx="${entry.center.x}" cy="${entry.center.y}" r="1"/>`)
        .reduce((source, polygon) => source + polygon);
      const remapper = new Remapper(mappedDistricts);
      remapper.onNext((d) => {
        mappingView.select(d.region, d.district);
        activateDistrict(d.center.x, d.center.y, d);
        mappedNumber.innerHTML = remapper.pointer;
        mappingView.save();
      });
      nextButton.onclick = () => remapper.next();
      previousButton.onclick = () => remapper.previous();
    });
  });


  canvas.onclick = (evt) => {
    const boundingRectangle = canvas.getBoundingClientRect();
    const x = evt.clientX - boundingRectangle.left;
    const y = evt.clientY - boundingRectangle.top;
    activateDistrict(x, y);
  };
}

document.onload = init();
