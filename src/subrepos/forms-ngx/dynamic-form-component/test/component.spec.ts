import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { DynamicFormComponent } from '../';
import { FieldControlService } from '../../field-control-service';

class MockFieldControlService {
  toFormGroup = jest.fn();
}

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  const formDescriptor: any = {
    fields: {
      fooField: {}
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [DynamicFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: FieldControlService, useClass: MockFieldControlService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
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
