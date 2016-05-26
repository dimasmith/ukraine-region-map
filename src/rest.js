export function sendDistrict(district) {
  const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
  return fetch('/api/v1/districts', {
    method: 'POST',
    body: JSON.stringify(district),
    headers
  });
}

export function fetchRegions() {
  const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
  return fetch('/api/v1/districts', {headers});
}
