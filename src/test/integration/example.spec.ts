import { TestBed } from '@angular/core/testing';

describe('Examp[le integration test', () => {
  const initTestBed = () => {
    jest.setTimeout(10000);

    TestBed.configureTestingModule({});
  };

  beforeEach(initTestBed);

  it('it must pass', () => {
    expect(true).toBe(true);
  });
});
