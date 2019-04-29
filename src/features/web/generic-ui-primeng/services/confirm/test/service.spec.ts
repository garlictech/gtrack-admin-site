import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmService } from '../../confirm/confirm.service';

export class MockTranslateService {
  instant(value) {
    return value;
  }
}

describe('ConfirmService', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmService, { provide: TranslateService, useClass: MockTranslateService }, ConfirmationService]
    });
    service = TestBed.get(ConfirmService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('confirm should call ConfirmationService', () => {
    const spy = spyOn(TestBed.get(ConfirmationService), 'confirm');
    service.confirm('Test Title');
    expect(spy).toHaveBeenCalled();
  });
});
