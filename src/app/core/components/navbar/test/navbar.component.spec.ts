import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  Actions as authActions
} from 'subrepos/gtrack-common-ngx/subrepos/authentication-api-ngx';
import { NavbarComponent } from '../navbar.component';

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;
// let store: MockStore<any>;
/*
describe('NavbarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent
      ],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          'feature': combineReducers(fromFeature.reducers)
        }),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    comp = fixture.debugElement.componentInstance;
    store = fixture.debugElement.injector.get(Store);
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  it('should update page title', fakeAsync(() => {
    let title = TestBed.get(Title);
    spyOn(title, 'getTitle').and.returnValue('fakeTitle');

    let router: Router;
    router = TestBed.get(Router);
    router.initialNavigation();
    router.navigate(['']);

    tick();

    fixture.detectChanges();
    expect(title.getTitle).toHaveBeenCalled();
    expect(comp.pageTitle).toEqual('fakeTitle');
  }));

  it('should call logout', async(() => {
    spyOn(store, 'dispatch').and.callThrough();

    const authAction = new authActions.LogoutStart();

    comp.logout();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(authAction);
  }));

  it('should sidebarToggle open mobile sidebar if it is hidden', async(() => {
    comp.sidebarVisible = false;
    spyOn(comp, 'sidebarOpen').and.stub();
    spyOn(comp, 'sidebarClose').and.stub();

    comp.sidebarToggle();
    fixture.detectChanges();

    expect(comp.sidebarOpen).toHaveBeenCalledTimes(1);
    expect(comp.sidebarClose).toHaveBeenCalledTimes(0);
  }));

  it('should sidebarToggle close mobile sidebar if it is opened', async(() => {
    comp.sidebarVisible = true;
    spyOn(comp, 'sidebarOpen').and.stub();
    spyOn(comp, 'sidebarClose').and.stub();

    comp.sidebarToggle();
    fixture.detectChanges();

    expect(comp.sidebarOpen).toHaveBeenCalledTimes(0);
    expect(comp.sidebarClose).toHaveBeenCalledTimes(1);
  }));

  it('should sidebarOpen updates sidebar settings and variables', async(() => {
    // Mock button classList
    comp.toggleButton = {
      classList: {
        add: function() {/* * /}
      }
    };

    comp.sidebarOpen();
    fixture.detectChanges();

    expect(document.body.classList.contains('nav-open')).toBeTruthy();
    expect(comp.sidebarVisible).toBeTruthy();
  }));

  it('should sidebarClose updates sidebar settings and variables', async(() => {
    // Mock button classList
    comp.toggleButton = {
      classList: {
        remove: function() {/** /}
      }
    };

    comp.sidebarClose();
    fixture.detectChanges();

    expect(document.body.classList.contains('nav-open')).toBeFalsy();
    expect(comp.sidebarVisible).toBeFalsy();
  }));
});
*/
