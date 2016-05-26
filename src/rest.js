const jsonHeaders = new Headers({
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

export function sendDistrict(district) {
  return fetch('/api/v1/districts', {
    method: 'POST',
    body: JSON.stringify(district),
    headers: jsonHeaders,
  });
}

export function fetchRegions() {
  return fetch('/api/v1/districts', { headers: jsonHeaders });
}
