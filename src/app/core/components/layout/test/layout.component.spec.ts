import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';

import { MockStore } from 'app/test/helpers/store/';

import { LayoutComponent } from '../layout.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

let comp: LayoutComponent;
let fixture: ComponentFixture<LayoutComponent>;

describe('LayoutComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LayoutComponent,
        NavbarComponent,
        SidebarComponent,
        FooterComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {
          provide: Store,
          useValue: new MockStore({})
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    comp = fixture.debugElement.componentInstance;
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
});
