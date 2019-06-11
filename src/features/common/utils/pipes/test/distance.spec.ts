import { UnitsService } from '@bit/garlictech.angular-features.common.units';
import { DistancePipe } from '../distance.pipe';

describe('DistancePipe', () => {
  it('should convert to meter', () => {
    const service = new UnitsService();
    const distance = new DistancePipe(service);

    expect(distance.transform(10)).toBe('10 m');
    expect(distance.transform(1100)).toBe('1.1 km');
  });
});
