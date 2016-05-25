export function storeRegion(region, district, polygon) {
  const data = {region, district, polygon};
  const key = `${region}/${district}`.toLowerCase();
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function loadRegions() {
  return Object.keys(window.localStorage)
    .map(key => window.localStorage.getItem(key))
    .map(itemJson => JSON.parse(itemJson));
}
