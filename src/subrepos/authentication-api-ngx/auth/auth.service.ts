import { combineLatest as observableCombineLatest, Observable, of as observableOf, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ApiService } from '../api';
import { User } from '../interfaces';
import { AUTH_CONFIG_TOKEN, IAuthenticationApiConfig } from '../lib/config';
import { DebugLog } from '../log';
import { LocalStorage } from '../storage/local-storage.service';
import { IAuth } from '../store';
import * as Actions from '../store/actions';

@Injectable()
export class AuthService {
  authenticated: Observable<IAuth>;

  private redirectUri: URL;

  private config: {
    redirectSlug: string;
  };

  constructor(
    private readonly api: ApiService,
    private readonly storage: LocalStorage,
    @Inject(AUTH_CONFIG_TOKEN) private readonly authConfig: IAuthenticationApiConfig,
    private readonly http: HttpClient,
    private readonly store: Store<any>
  ) {
    this.authenticated = this.initFromLocalStore();
  }

  @DebugLog init(token: string, refreshToken?: string | null): Observable<IAuth> {
    this.storage.setItem('token', token);

    if (refreshToken) {
      this.storage.setItem('refreshToken', refreshToken);
    }

    refreshToken = this.storage.getItem('refreshToken');

    this.config = { ...this.authConfig.verify };
    this.redirectUri = new URL(`${this.authConfig.webserverUrl}${this.config.redirectSlug}`);

    return (this.authenticated = this.api.get<User>(`${this.authConfig.apiUrl}/user/me`).pipe(
      switchMap(response => {
        const user = response;

        // let afObs = this.afAuth ? this._getFirebaseData() : Observable.of({ firebaseToken: null, firebaseUser: null });

        const afObs = observableOf({ firebaseToken: null, firebaseUser: null });

        return observableCombineLatest(observableOf({ token, refreshToken, user }), afObs);
      }),
      map(values => {
        const auth: IAuth = {
          token: values[0].token,
          refreshToken: values[0].refreshToken,
          user: values[0].user
        };

        return auth;
      })
    ));
  }

  @DebugLog initFromLocalStore() {
    const token = this.storage.getItem('token');
    const refreshToken = this.storage.getItem('refreshToken');

    if (token) {
      return this.init(token, refreshToken);
    } else {
      this.store.dispatch(new Actions.LoginSuccess(null));
      return throwError({});
    }
  }

  @DebugLog refreshToken(): Observable<IAuth> {
    const refreshToken = this.storage.getItem('refreshToken');

    if (!refreshToken) {
      return throwError(new Error('Missing refresh token'));
    }

    return this.http
      .get<{
        token: string;
      }>(`${this.authConfig.apiUrl}/auth/token`, {
        params: {
          refreshToken
        }
      })
      .pipe(
        switchMap(body => {
          const token = body.token;

          return this.init(token);
        })
      );
  }

  @DebugLog destroyRefreshToken(): Observable<void> {
    const refreshToken = this.storage.getItem('refreshToken');

    if (!refreshToken) {
      return observableOf(undefined);
    }

    return this.http.delete(`${this.authConfig.apiUrl}/auth/token/${refreshToken}`).pipe(map(() => undefined));
  }

  @DebugLog logout(): Observable<void> {
    this.storage.removeItem('token');

    return this.destroyRefreshToken().pipe(
      map(() => this.storage.removeItem('refreshToken')),
      map(() => undefined)
    );
  }

  @DebugLog getFirebaseToken(): Observable<Object | null> {
    return this.api.get(`${this.authConfig.apiUrl}/auth/firebase/token`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return observableOf(null);
        }

        return throwError(err);
      })
    );
  }

  /**
   * Request new verify token
   */
  requestVerifyToken(email: string): Observable<any> {
    const tokenRequestUrl = `${this.authConfig.apiUrl}/auth/verify/request`;

    return this.api.post(tokenRequestUrl, {
      email,
      redirectUri: this.redirectUri.toString()
    });
  }

  /**
   * Verify user by token
   */
  verify(token: string, uid: string): Observable<IAuth> {
    const verifyUrl = `${this.authConfig.apiUrl}/auth/verify`;

    return this.api
      .post<{
        token: string;
      }>(verifyUrl, {
        token,
        uid
      })
      .pipe(
        switchMap(body => {
          const responseToken = body.token;

          return this.init(responseToken);
        })
      );
  }
}
