import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Data, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../navbar.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { MockStore } from '../../../../store/';
import { Actions as authActions } from 'authentication-api-ngx';

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;
let _store: MockStore<any>;

describe('NavbarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent
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

    fixture = TestBed.createComponent(NavbarComponent);
    comp = fixture.debugElement.componentInstance;
    _store = fixture.debugElement.injector.get(Store);

    spyOn(_store, 'dispatch').and.callThrough();
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  it('should call logout', async(() => {
    const authAction = new authActions.LogoutStart();

    comp.logout();
    fixture.detectChanges();

    expect(_store.dispatch).toHaveBeenCalledWith(authAction);
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
        add: function() {/**/}
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
        remove: function() {/**/}
      }
    };

    comp.sidebarClose();
    fixture.detectChanges();

    expect(document.body.classList.contains('nav-open')).toBeFalsy();
    expect(comp.sidebarVisible).toBeFalsy();
  }));
});
