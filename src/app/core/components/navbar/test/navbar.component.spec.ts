import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Actions as authActions } from 'subrepos/authentication-api-ngx';
import { MockStore } from '../../../../test/helpers/store/mock-store';
import { NavbarComponent } from '../navbar.component';

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;
let store: Store<any>;

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
});
