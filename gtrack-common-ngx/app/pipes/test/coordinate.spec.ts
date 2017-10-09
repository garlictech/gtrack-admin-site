import { CoordinatePipe } from '../coordinate.pipe';

describe('CoordinatePipe', () => {

  it('should round to 5 digits', () => {
    let coordinate = new CoordinatePipe();

    expect(coordinate.transform(47.73982119999999)).toBe(47.73982);
  });
});
