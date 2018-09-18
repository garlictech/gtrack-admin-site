import { combineLatest as observableCombineLatest, Observable, throwError, of as observableOf } from 'rxjs';

<<<<<<< HEAD
import { catchError, map, switchMap } from 'rxjs/operators';
=======
import { catchError,  map, switchMap } from 'rxjs/operators';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { LocalStorage } from '../storage/local-storage.service';
import { User } from '../interfaces';
import { IAuth } from '../store';
import * as Actions from '../store/actions';
import { AUTH_CONFIG_TOKEN, IAuthenticationApiConfig } from '../lib/config';
import { ApiService } from '../api';
import { DebugLog } from '../log';

@Injectable()
export class AuthService {
  authenticated: Observable<IAuth>;

  private redirectUri: URL;

  private config: {
    redirectSlug: string;
  };

  constructor(
    private api: ApiService,
    private storage: LocalStorage,
    @Inject(AUTH_CONFIG_TOKEN) private authConfig: IAuthenticationApiConfig,
    private http: HttpClient,
    private store: Store<any>
  ) {
    this.authenticated = this.initFromLocalStore();
  }

  @DebugLog
  init(token: string, refreshToken?: string | null): Observable<IAuth> {
    this.storage.setItem('token', token);

    if (refreshToken) {
      this.storage.setItem('refreshToken', refreshToken);
    }

    refreshToken = this.storage.getItem('refreshToken');

    this.config = { ...this.authConfig.verify };
    this.redirectUri = new URL(`${this.authConfig.webserverUrl}${this.config.redirectSlug}`);

<<<<<<< HEAD
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
=======
    return (this.authenticated = this.api
      .get<User>(`${this.authConfig.apiUrl}/user/me`)
      .pipe(
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
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  @DebugLog
  initFromLocalStore() {
    const token = this.storage.getItem('token');
    const refreshToken = this.storage.getItem('refreshToken');

    if (token) {
      return this.init(token, refreshToken);
    } else {
      this.store.dispatch(new Actions.LoginSuccess(null));
      return throwError({});
    }
  }

  @DebugLog
  refreshToken(): Observable<IAuth> {
    const refreshToken = this.storage.getItem('refreshToken');

    if (!refreshToken) {
      return throwError(new Error('Missing refresh token'));
    }

    return this.http
      .get<{
<<<<<<< HEAD
        token: string;
=======
        token: string
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
      }>(`${this.authConfig.apiUrl}/auth/token`, {
        params: {
          refreshToken: refreshToken
        }
      })
      .pipe(
        switchMap(body => {
          const token = body.token;

          return this.init(token);
        })
      );
  }

  @DebugLog
  destroyRefreshToken(): Observable<void> {
    const refreshToken = this.storage.getItem('refreshToken');

    if (!refreshToken) {
      return observableOf(undefined);
    }

<<<<<<< HEAD
    return this.http.delete(`${this.authConfig.apiUrl}/auth/token/${refreshToken}`).pipe(map(() => undefined));
=======
    return this.http.delete(`${this.authConfig.apiUrl}/auth/token/${refreshToken}`)
      .pipe(
        map(() => undefined)
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  @DebugLog
  logout(): Observable<void> {
    this.storage.removeItem('token');

<<<<<<< HEAD
    return this.destroyRefreshToken().pipe(
      map(() => this.storage.removeItem('refreshToken')),
      map(() => undefined)
    );
=======
    return this.destroyRefreshToken()
      .pipe(
        map(() => this.storage.removeItem('refreshToken')),
        map(() => undefined)
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  @DebugLog
  getFirebaseToken(): Observable<Object | null> {
<<<<<<< HEAD
    return this.api.get(`${this.authConfig.apiUrl}/auth/firebase/token`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return observableOf(null);
        }

        return throwError(err);
      })
    );
=======
    return this.api
      .get(`${this.authConfig.apiUrl}/auth/firebase/token`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            return observableOf(null);
          }

          return throwError(err);
        })
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  /**
   * Request new verify token
   */
  public requestVerifyToken(email: string): Observable<any> {
    const tokenRequestUrl = `${this.authConfig.apiUrl}/auth/verify/request`;

<<<<<<< HEAD
    return this.api.post(tokenRequestUrl, {
      email: email,
      redirectUri: this.redirectUri.toString()
    });
=======
    return this.api
      .post(tokenRequestUrl, {
        email: email,
        redirectUri: this.redirectUri.toString()
      });
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  /**
   * Verify user by token
   */
  public verify(token: string, uid: string): Observable<IAuth> {
    const verifyUrl = `${this.authConfig.apiUrl}/auth/verify`;

    return this.api
      .post<{
<<<<<<< HEAD
        token: string;
=======
        token: string
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
      }>(verifyUrl, {
        token: token,
        uid: uid
      })
      .pipe(
        switchMap(body => {
          const responseToken = body.token;

          return this.init(responseToken);
        })
      );
  }
}
