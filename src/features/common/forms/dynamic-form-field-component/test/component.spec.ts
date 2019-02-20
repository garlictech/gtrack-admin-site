import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DynamicFormFieldComponent } from '../';

class MockTranslateService {}

describe('DynamicFormFieldComponent', () => {
  @Component({ selector: 'app-testcomponent', template: '' })
  class TestComponent extends DynamicFormFieldComponent {
    _destroy = jest.fn();

    constructor(_translate: TranslateService, _store: Store<any>) {
      super(_translate, _store);
    }
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  const field: any = {};

  const formDescriptor: any = {
    fields: {
      fooField: {}
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [TestComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: TranslateService, useClass: MockTranslateService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.field = field;
    component.formDescriptor = formDescriptor;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('it should be created', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnDestroy should call _destroy', () => {
    component.ngOnDestroy();
    expect(component._destroy).toHaveBeenCalled();
  });

  describe('Test getOnchange', () => {
    beforeEach(() => {
      component.formDescriptor.submit = { submitFv: jest.fn() };
    });

    it('getOnChange should submit the form if the field has submitOnChange', () => {
      component.field.submitOnChange = true;
      component.getOnChange()();
      expect(component.formDescriptor.submit.submitFv).toHaveBeenCalledWith(component.form);
    });

    it('getOnChange should not submit the form if the field has no submitOnChange', () => {
      component.field.submitOnChange = false;
      component.getOnChange()();
      expect(component.formDescriptor.submit.submitFv).not.toHaveBeenCalled();
    });
  });

  it('sanitizedPlaceholder should work if it has no placeholder', () => {
    expect(component.sanitizedPlaceholder).toMatchSnapshot();
  });

  it('sanitizedPlaceholder should work if it has placeholder', () => {
    component.field.placeholder = 'fooplaceholder';
    expect(component.sanitizedPlaceholder).toMatchSnapshot();
  });

  it('labelParams return labelparams if defined', () => {
    component.field.labelParams = { foo: 'bar' };
    expect(component.labelParams).toEqual({ foo: 'bar' });
  });

  it('labelParams return {} if undefined', () => {
    component.field.labelParams = undefined;
    expect(component.labelParams).toEqual({});
  });

  it('containerClasses shold return proper values if the field is not switch', () => {
    expect(component.containerClasses).toMatchSnapshot();
  });

  it('containerClasses shold return proper values if the field is switch', () => {
    component.field.controlType = 'switch';
    expect(component.containerClasses).toMatchSnapshot();
  });
});
