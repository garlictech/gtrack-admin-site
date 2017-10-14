import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';

import { Actions as authActions } from '../../../../../subrepos/authentication-api-ngx';
import { MockStore } from '../../../../test/helpers/store/';

import { LoginComponent } from '../login.component';

let comp: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let store: any;

describe('LoginComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      providers: [
        {
          provide: Store,
          useValue: new MockStore({})
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    store = fixture.debugElement.injector.get(Store);
    comp = fixture.componentInstance;

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  it('should call googleLogin', async(() => {
    const action = new authActions.GoogleLogin(['admin']);

    comp.login();
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  }));
});
