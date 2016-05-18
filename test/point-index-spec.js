import {expect} from "chai";
import PointIndex from "../src/point-index";

describe('point index', () => {

  let pointIndex;

  beforeEach(() => {
    pointIndex = new PointIndex();
  });

  it('reports existing point as present', () => {
    const point = {x: 1, y: 2};
    pointIndex.addPoint(point);

    expect(pointIndex.hasPoint({x: 1, y: 2})).to.eql(true);
  });
});
