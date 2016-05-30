import { expect } from 'chai';
import PointIndex from '../../src/point-index';
import trackPath from '../../src/path-tracker';

describe('path tracker', () => {
  /**
   00xx00
   0x00x0
   00xx00
   */
  it('should track path shape', () => {
    const outline = new PointIndex([
      { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 1, y: 1 }, { x: 4, y: 1 },
      { x: 2, y: 2 }, { x: 3, y: 2 }]);

    const path = trackPath(outline, { x: 1, y: 1 });

    expect(path).to.eql([
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

    expect(path).to.eql([
      { x: 0, y: 2 }, { x: 1, y: 1 }, { x: 1, y: 0 },
      { x: 2, y: 2 }, { x: 1, y: 3 },
    ]);
  });
});
