import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Actions as authActions } from 'authentication-api-ngx';
import { Observable } from 'rxjs';
import { MockStore, GtActions } from '../../../../store/';
import { GtMaterialModule } from '../../../../material.module';
import { LayoutComponent } from '../layout.component';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { NavItemComponent } from '../../nav-item/nav-item.component';

let comp: LayoutComponent;
let fixture: ComponentFixture<LayoutComponent>;
let _store: any;

describe('LayoutComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LayoutComponent,
                NavItemComponent,
                SidenavComponent,
                ToolbarComponent
            ],
            imports: [
                GtMaterialModule,
                NoopAnimationsModule,
                RouterTestingModule
            ],
            providers: [
                {
                    provide: Store,
                    useValue: new MockStore({
                        layout: {
                            showSidenav: false
                        }
                    })
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LayoutComponent);
        _store = fixture.debugElement.injector.get(Store);
        comp = fixture.debugElement.componentInstance;

        spyOn(_store, 'dispatch').and.callThrough();
    });

    it('should create the component', async(() => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    }));

    it('should call closeSidenav', async(() => {
        const action = new GtActions.CloseSidenavAction();

        comp.closeSidenav();
        fixture.detectChanges();
        expect(_store.dispatch).toHaveBeenCalledWith(action);
    }));

    it('should call openSidenav', async(() => {
        const action = new GtActions.OpenSidenavAction();

        comp.openSidenav();
        fixture.detectChanges();
        expect(_store.dispatch).toHaveBeenCalledWith(action);
    }));

    /*
    it('should call handleSidenav', async(() => {
        const openAction = new GtActions.OpenSidenavAction();
        const closeAction = new GtActions.CloseSidenavAction();

        comp.handleSidenav();
        comp.showSidenav$ = Observable.of(false);
        fixture.detectChanges();
        expect(_store.dispatch).toHaveBeenCalledWith(openAction);

        comp.showSidenav$ = Observable.of(true);

        fixture.detectChanges();
        expect(_store.dispatch).toHaveBeenCalledWith(closeAction);
    }));
    */

    it('should call logout', async(() => {
        const authAction = new authActions.LogoutStart();
        const sidenavAction = new GtActions.CloseSidenavAction();

        comp.logout();
        fixture.detectChanges();
        expect(_store.dispatch).toHaveBeenCalledWith(authAction);
        expect(_store.dispatch).toHaveBeenCalledWith(sidenavAction);
    }));
});
