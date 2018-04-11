/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LanguageService } from '..';

describe('LanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageService]
    });
  });

  it(
    'should ...',
    inject([LanguageService], (service: LanguageService) => {
      expect(service).toBeTruthy();
    })
  );
});
