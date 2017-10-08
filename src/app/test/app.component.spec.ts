import { RouterTestingModule } from '@angular/router/testing';
import { fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { MockStore } from '../test-helpers/store/';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let store: any;

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: Store,
          useValue: new MockStore({
            authentication: {
              auth: {}
            }
          })
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    store = fixture.debugElement.injector.get(Store);
    comp = fixture.componentInstance;
  });

  it('should create the app', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
});
