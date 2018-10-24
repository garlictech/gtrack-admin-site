import { ObjectToArrayPipe } from '../object-to-array.pipe';

describe('ObjectToArrayPipe', () => {
  let pipe: ObjectToArrayPipe;

  beforeEach(() => {
    pipe = new ObjectToArrayPipe();
  });

  it('providing no value returns fallback', () => {
    expect(pipe.transform('')).toEqual([]);
  });

  it('providing empty object returns empty array', () => {
    expect(pipe.transform({})).toEqual([]);
  });

  it('providing an object returns array', () => {
    const inputObj = {
      key1: 'value1',
      key2: 'value2'
    };
    const resArr = [
      {
        key: 'key1',
        value: 'value1'
      },
      {
        key: 'key2',
        value: 'value2'
      }
    ];
    expect(pipe.transform(inputObj)).toEqual(resArr);
  });
});
