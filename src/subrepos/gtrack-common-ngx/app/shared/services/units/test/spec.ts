/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnitsService } from '..';

describe('UnitsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitsService]
    });
  });

  it(
    'should ...',
    inject([UnitsService], (service: UnitsService) => {
      expect(service).toBeTruthy();
    })
  );
});
