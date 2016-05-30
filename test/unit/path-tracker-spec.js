import { expect } from 'chai';
import PointIndex from '../../src/graphics/raster/points';
import { trackPath } from '../../src/graphics/raster/tracking';

describe('path tracker', () => {
  it('should track path shape', () => {
    const outline = new PointIndex([
      { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 1, y: 1 }, { x: 4, y: 1 },
      { x: 2, y: 2 }, { x: 3, y: 2 }]);

    const path = trackPath(outline, { x: 1, y: 1 });

    expect(path.listPoints()).to.eql([
      { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 4, y: 1 }, { x: 3, y: 2 }, { x: 2, y: 2 },
    ]);
  });

  it('should track pointy shapes', () => {
    const outline = new PointIndex([
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 }, { x: 2, y: 2 },
      { x: 1, y: 3 },
    ]);

    const path = trackPath(outline, { x: 0, y: 2 });

    expect(path.listPoints()).to.eql([
      { x: 0, y: 2 }, { x: 1, y: 1 }, { x: 1, y: 0 },
      { x: 2, y: 2 }, { x: 1, y: 3 },
    ]);
  });
});
