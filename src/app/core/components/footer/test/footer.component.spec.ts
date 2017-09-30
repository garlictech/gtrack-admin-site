import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FooterComponent } from '../footer.component';
// For date pipe
import 'intl/index';
import 'intl/locale-data/jsonp/en.js';

let comp: FooterComponent;
let fixture: ComponentFixture<FooterComponent>;
let _store: any;

describe('FooterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FooterComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    comp = fixture.debugElement.componentInstance;
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
});
