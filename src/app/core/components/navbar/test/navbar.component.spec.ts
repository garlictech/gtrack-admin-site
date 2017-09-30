import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Data } from '@angular/router';

import { NavbarComponent } from '../navbar.component';

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
          provide: ActivatedRoute,
          useValue: {
            data: {
              subscribe: (fn: (value: Data) => void) => fn({
                yourData: 'fakeroute'
              })
            }
          }
        }, {
          provide: Store,
          useValue: new MockStore({})
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    _store = fixture.debugElement.injector.get(Store);
    comp = fixture.debugElement.componentInstance;

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
});
