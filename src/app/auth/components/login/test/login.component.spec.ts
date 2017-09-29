import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Component } from '@angular/core';
import { Actions as authActions } from 'authentication-api-ngx';
import { Observable } from 'rxjs';
import { MockStore } from '../../../../store/';
import { LoginComponent } from '../login.component';

let comp: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let _store: any;

describe('LoginComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            providers: [
                {
                    provide: Store,
                    useValue: new MockStore({
                        authentication: {
                            auth: {
                                token: null
                            }
                        }
                    })
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        _store = fixture.debugElement.injector.get(Store);
        comp = fixture.componentInstance;

        spyOn(_store, 'dispatch').and.callThrough();
    });

    it('should create the component', async(() => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    }));

    it('should redirect to dashboard if auth token exists', async(() => {
        const action = go(['/']);
        _store.next({
            authentication: {
                auth: {
                    token: 'faketoken'
                }
            }
        });

        fixture.detectChanges();
        expect(_store.dispatch).toHaveBeenCalledWith(action);
    }));

    it('should call googleLogin', async(() => {
        const action = new authActions.GoogleLogin(['admin']);

        comp.login();
        fixture.detectChanges();
        expect(_store.dispatch).toHaveBeenCalledWith(action);
    }));
});
