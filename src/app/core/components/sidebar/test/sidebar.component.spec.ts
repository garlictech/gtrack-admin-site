import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from '../sidebar.component';
import { Store, Action } from '@ngrx/store';
import { MockStore } from '../../../../store/';
import { Actions as authActions } from 'authentication-api-ngx';

declare const $: any;
declare const window: any;

let comp: SidebarComponent;
let fixture: ComponentFixture<SidebarComponent>;
let _store: any;

describe('SidebarComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          SidebarComponent
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
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    comp = fixture.debugElement.componentInstance;
    _store = fixture.debugElement.injector.get(Store);

    spyOn(_store, 'dispatch').and.callThrough();
  }));

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  it('should show mobile menu on small screen', async(() => {
    window.outerWidth = 100;
    let isMobileMenu = comp.isMobileMenu();
    fixture.detectChanges();

    expect(isMobileMenu).toBe(true);
  }));

  it('should hide mobile menu on wide screen', async(() => {
    window.outerWidth = 1000;
    let isMobileMenu = comp.isMobileMenu();
    fixture.detectChanges();

    expect(isMobileMenu).toBe(false);
  }));

  it('should call logout', async(() => {
    const authAction = new authActions.LogoutStart();

    comp.logout();
    fixture.detectChanges();

    expect(_store.dispatch).toHaveBeenCalledWith(authAction);
  }));
});
