var poi = {
  gremyach: new GeoPoint(52.2004, 33.1719),
  foros: new GeoPoint(44.2311, 33.4638),
  solomonovo: new GeoPoint(48.2250, 22.0950),
  rannyaZorya: new GeoPoint(49.1533, 40.1153),
  kyiv: new GeoPoint(50.2700, 30.3124),
  lviv: new GeoPoint(49.4948, 24.0051),
  odesa: new GeoPoint(46.2906, 30.4436),
  kharkiv: new GeoPoint(50.0021, 36.1345)
};

function init() {
  var canvas = document.getElementById('map');
  var projector = new MerkatorProjection(
    new GeoBounds(poi.solomonovo.lon, poi.gremyach.lat, poi.rannyaZorya.lon, poi.foros.lat),
    new ImageSize.of(canvas),
    new Offset(17, 22, 13, 18));
  var projectionView = new MapView(canvas, projector);
  projectionView.render();
  // var geoPoints = points.map(function (p) {
  //   return new GeoPoint(p.lat, p.lon);
  // });
  // projectionView.updateModel({points: geoPoints});
  // projectionView.updateModel({points: [poi.gremyach, poi.foros, poi.solomonovo, poi.rannyaZorya]})
}

document.onload = init();
