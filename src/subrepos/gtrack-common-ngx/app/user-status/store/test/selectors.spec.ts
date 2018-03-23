import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';

import { Subject } from 'rxjs/Subject';

import { userStatusReducer } from '../reducer';
import { IUserStatusState } from '../state';

import * as actions from '../actions';
import { UserStatusSelectors } from '../selectors';
import { EXTERNAL_USER_STATUS_DEPENDENCIES } from '../../externals';

describe('UserStateSelectors', () => {
  let destroy$: Subject<boolean>;
  let store: Store<IUserStatusState>;

  beforeEach(() => {
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          userStatus: userStatusReducer
        })
      ],
      providers: [
        UserStatusSelectors,
        {
          provide: EXTERNAL_USER_STATUS_DEPENDENCIES,
          useValue: {
            storeDomain: 'userStatus'
          }
        }
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getUserLocation', () => {
    it("should return the user's current location", () => {
      let result;
      let selectors: UserStatusSelectors = TestBed.get(UserStatusSelectors);

      store
        .select(selectors.getUserLocation)
        .takeUntil(destroy$)
        .subscribe(location => (result = location));

      expect(result).toEqual([0, 0]);

      store.dispatch(new actions.LocationRequested([1, 1]));

      expect(result).toEqual([1, 1]);
    });
  });

});
