import { expect } from 'chai';
import PointIndex from '../../src/graphics/raster/point-index';

describe('point index', () => {
  it('reports existing point as present', () => {
    const point = { x: 1, y: 2 };
    const pointIndex = new PointIndex();
    pointIndex.addPoint(point);

    expect(pointIndex.hasPoint({ x: 1, y: 2 })).to.eql(true);
  });

  it('counts point upon initialization', () => {
    const newIndex = new PointIndex([{ x: 1, y: 1 }, { x: 2, y: 2 }]);
    expect(newIndex.size()).to.eql(2);
  });

  it('counts point upon adding points', () => {
    const newIndex = new PointIndex();
    newIndex.addPoint({ x: 1, y: 2 });
    expect(newIndex.size()).to.eql(1);
  });

  it('new index has size of 0', () => {
    const newIndex = new PointIndex();
    expect(newIndex.size()).to.eql(0);
  });
});
