/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSelectComponent } from '..';

describe('DropdownSelectComponent', () => {
  let component: DropdownSelectComponent;
  let fixture: ComponentFixture<DropdownSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownSelectComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
