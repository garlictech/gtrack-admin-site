import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DynamicFormFieldComponent } from '../';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

class MockTranslateService {}

describe('DynamicFormFieldComponent', () => {
  let component: DynamicFormFieldComponent;
  let fixture: ComponentFixture<DynamicFormFieldComponent>;
  const field: any = {};

  const formDescriptor: any = {
    fields: {
      fooField: {}
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [DynamicFormFieldComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: TranslateService, useClass: MockTranslateService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormFieldComponent);
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
});
