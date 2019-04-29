import { AlertService } from '../../alert/alert.service';
import { ConfirmService } from '../../confirm/confirm.service';
import { GenericUiPlatformService } from '../../generic-ui-platform-service/generic-ui-platform.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';

class MockAlertService {
  alert() {
    return of(true);
  }
}

class MockConfirmService {
  confirm() {
    return of(true);
  }
}

class MockMessageService {
  add = jest.fn();
}

describe('PaycapPlatformService', () => {
  let service: GenericUiPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GenericUiPlatformService,
        { provide: AlertService, useClass: MockAlertService },
        { provide: ConfirmService, useClass: MockConfirmService },
        { provide: MessageService, useClass: MockMessageService }
      ]
    });
    service = TestBed.get(GenericUiPlatformService);
  });

  it('it should be created', () => {
    expect(service).toBeTruthy();
  });

  it('alert should return an observable from AlertService', () => {
    const expectedValue = of(true);
    spyOn(TestBed.get(AlertService), 'alert').and.returnValue(expectedValue);
    expect(service.alert('Test alert')).toEqual(expectedValue);
  });

  it('confirm should return an observable from ConfirmService', () => {
    const expectedValue = of(true);
    spyOn(TestBed.get(ConfirmService), 'confirm').and.returnValue(expectedValue);
    expect(service.confirm('Test confirmation')).toEqual(expectedValue);
  });

  it('displayToast should call messageService.add', () => {
    const messageService = TestBed.get(MessageService);
    service.displayToast('FOOBAR' as any);
    expect(messageService.add).toHaveBeenCalledWith('FOOBAR');
  });
});
