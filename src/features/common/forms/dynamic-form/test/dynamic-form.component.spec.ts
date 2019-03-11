import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import createMockInstance from 'jest-create-mock-instance';
import { hot, Scheduler } from 'jest-marbles';
import { DynamicFormComponent } from '../dynamic-form.component';
import { FieldControlService } from '../../field-control/field-control.service';
const __store = require('@ngrx/store');

describe('DynamicFormComponent', () => {
  class MockFieldControlService {
    toFormGroup = jest.fn().mockReturnValue({ form: { patchValue: jest.fn() } });
  }

  const formDescriptor: any = {
    fields: { fooField: { foo: 'field' } },
    formDataSelector: 'foobar',
    submit: {
      submitFv: jest.fn(),
      resetFv: jest.fn().mockReturnValue('valueAfterReset')
    }
  };

  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let fcs: FieldControlService;

  const initTestBed = (mockFormData, mockFormDescriptor = formDescriptor) => {
    TestBed.resetTestingModule();

    __store.select = jest.fn().mockReturnValue(() =>
      hot('--a', {
        a: mockFormData
      })
    );

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [DynamicFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: FieldControlService, useClass: MockFieldControlService }]
    }).compileComponents();

    fcs = TestBed.get(FieldControlService);
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    component.formDescriptor = mockFormDescriptor;
    fixture.detectChanges();
  };

  afterEach(() => {
    fixture.destroy();
  });

  it('ngAfterViewInit should handle formDataSelector', () => {
    const mockFormData = { fooField: 'formData' };
    initTestBed(mockFormData);
    Scheduler.get().flush();
    expect(component.formInstance.form.patchValue).toHaveBeenCalledWith(mockFormData);
  });

  it('ngAfterViewInit should handle formDataSelector if there is no formData emitted', () => {
    const mockFormData = undefined;
    initTestBed(mockFormData);
    Scheduler.get().flush();
    expect(component.formInstance.form.patchValue).not.toHaveBeenCalled();
    const call = (fcs.toFormGroup as any).mock.calls;
    expect(call).toMatchSnapshot();
  });

  it('ngAfterViewInit should handle formDataSelector if there is no formDataSelector defined', () => {
    const mockFormData = undefined;
    initTestBed(mockFormData);
    Scheduler.get().flush();
    expect(component.formInstance.form.patchValue).not.toHaveBeenCalled();
    const call = (fcs.toFormGroup as any).mock.calls;
    expect(call).toMatchSnapshot();
  });

  describe('Test onSubmit', () => {
    const testControl: jest.Mocked<FormControl> = createMockInstance(FormControl);

    beforeEach(() => {
      initTestBed(undefined);
      Scheduler.get().flush();

      component.formInstance.form = {
        valid: true,
        controls: {
          foo: 'bar'
        },
        get: () => testControl
      } as any;
    });

    describe('onSubmit should submit the form if it is valid', () => {
      it('and it should not reset the form if resetOnSubmit is not set', () => {
        component.onSubmit(undefined);
        expect(formDescriptor.submit.resetFv).not.toHaveBeenCalled();
        expect(testControl.markAsTouched).not.toHaveBeenCalled();
        expect(formDescriptor.submit.submitFv).toHaveBeenCalledWith(component.formInstance.form);
        expect(testControl.markAsTouched).not.toHaveBeenCalled();
      });

      it('and it should reset the form with the submited reset function if resetOnSubmit is set', () => {
        component.formDescriptor.submit.resetOnSubmit = true;
        component.onSubmit(undefined);
        expect(formDescriptor.submit.resetFv).toHaveBeenCalledWith(component.formDescriptor);
        expect(component.formInstance).toMatchSnapshot();
      });

      it('and it should reset the form with empty object if resetOnSubmit is set and there is no proper reset function', () => {
        component.formDescriptor.submit.resetOnSubmit = true;
        (component.formDescriptor.submit as any).resetFv = {};
        component.onSubmit(undefined);
        expect(fcs.toFormGroup).toHaveBeenCalledWith(component.formDescriptor.fields, {});
      });
    });

    it('form validation should handle form arrays as well', () => {
      (component.formInstance.form as any).valid = false;
      component.onSubmit(undefined);
      expect(testControl.markAsTouched).toHaveBeenCalledWith({ onlySelf: true });
    });

    it('onSubmit should call the event.preventDefault if event is passed', () => {
      const event = { preventDefault: jest.fn() };
      component.onSubmit(event as any);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('getOnSubmit should return the onSubmit function', () => {
      expect(component.getOnSubmit()()).toEqual(component.onSubmit());
    });

    xit('validateForm should handle form arrays as well', () => {
      const control = new FormArray([testControl]);

      component.formInstance.form = {
        valid: false,
        controls: { foo: control },
        get: jest
          .fn()
          .mockReturnValueOnce(control)
          .mockReturnValueOnce(testControl)
      } as any;

      component.onSubmit(undefined);
      expect(testControl.markAsTouched).toHaveBeenCalledWith({ onlySelf: true });
    });
  });
});
