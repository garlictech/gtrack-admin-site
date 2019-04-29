import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from '../alert.service';

export class MockTranslateService {
  instant(value) {
    return value;
  }
}

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService, { provide: TranslateService, useClass: MockTranslateService }, ConfirmationService]
    });
    service = TestBed.get(AlertService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('upload should call ConfirmationService', () => {
    const spy = spyOn(TestBed.get(ConfirmationService), 'confirm');
    service.alert('Test Title');
    expect(spy).toHaveBeenCalled();
  });
});
