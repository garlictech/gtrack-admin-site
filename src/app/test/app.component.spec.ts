import { RouterTestingModule } from '@angular/router/testing';
import { fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { MockStore } from '../store/';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let _store: any;

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
    _store = fixture.debugElement.injector.get(Store);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    delete $.material;
  });

  it('should create the app', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
});
