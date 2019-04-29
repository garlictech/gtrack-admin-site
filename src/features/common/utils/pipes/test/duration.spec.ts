import { DurationPipe } from '../duration.pipe';

describe('DurationPipe', () => {
  it('should convert minutes to duration string', () => {
    const duration = new DurationPipe();
    expect(duration.transform(121)).toEqual('02:01');
    expect(duration.transform(1220)).toEqual('20:20');
  });
});
