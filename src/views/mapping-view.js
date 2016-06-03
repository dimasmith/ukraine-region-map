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

class MappingView {
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
    const selectedDistrict = this.state.district || districts[0];

    const $region = document.querySelector('.properties__region');
    const $district = document.querySelector('.properties__district');
    const $saveButton = document.querySelector('.properties__save-button');
    const $regionOptions = regions.map(region => createOptionElement(region));
    $regionOptions.forEach(option => $region.appendChild(option));
    const $districtOptions = districts.map(district => createOptionElement(district));
    $districtOptions.forEach(district => $district.appendChild(district));

    $region.value = selectedRegion;
    $district.value = selectedDistrict;

    $region.onchange = () => {
      removeAllChildElements($district);
      this.updateState({ region: $region.value });
    };

    $district.onchange = () => {
      this.updateState({ region: $region.value, district: $district.value });
    };

    $saveButton.onclick = () => {
      this.saveCallback($region.value, $district.value);
    };
  }

  onSave(callback) {
    this.saveCallback = callback;
  }

  save() {
    this.saveCallback(this.state.region, this.state.district);
  }

  select(region, district) {
    this.updateState({ region, district });
  }
}

export default MappingView;
export { MappingView };
