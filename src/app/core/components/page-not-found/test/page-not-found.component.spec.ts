import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PageNotFoundComponent } from '../page-not-found.component';

let comp: PageNotFoundComponent;
let fixture: ComponentFixture<PageNotFoundComponent>;
let _store: any;

describe('PageNotFoundComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageNotFoundComponent
      ],
      imports: [
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    comp = fixture.debugElement.componentInstance;
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
});
