import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, Action } from '@ngrx/store';

import { Actions as authActions } from 'subrepos/authentication-api-ngx';
import { MockStore } from 'app/test/helpers/store/';

import { SidebarComponent } from '../sidebar.component';

declare const $: any;
declare const window: any;

let comp: SidebarComponent;
let fixture: ComponentFixture<SidebarComponent>;
let store: any;

describe('SidebarComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: Store,
          useValue: new MockStore({})
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    comp = fixture.debugElement.componentInstance;
    store = fixture.debugElement.injector.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  }));

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  it('should call logout', async(() => {
    const authAction = new authActions.LogoutStart();

    comp.logout();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(authAction);
  }));
});