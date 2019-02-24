// tslint:disable:no-floating-promises
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectComponent } from '../';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiSelectComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
