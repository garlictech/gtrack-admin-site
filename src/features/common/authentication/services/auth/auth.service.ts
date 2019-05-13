import { combineLatest as observableCombineLatest, Observable, of as observableOf, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';

import { User } from '../../interfaces';
import { DebugLog } from '../../log';
import { Auth, AuthenticationActions as Actions } from '../../store';
import { ApiService } from '../api';
import { LocalStorage } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticated: Observable<Auth>;

  private redirectUri: URL;

  private authConfig: {
    apiUrl: string;
  };

  constructor(
    private readonly api: ApiService,
    private readonly storage: LocalStorage,
    private readonly http: HttpClient,
    private readonly store: Store<any>
  ) {
    this.authenticated = this.initFromLocalStore();
    this.authConfig = { apiUrl: 'https://9i0oeair61.execute-api.us-east-1.amazonaws.com/latest' };
  }

  @DebugLog init(token: string, refreshToken?: string | null): Observable<Auth> {
    this.storage.setItem('token', token);

    if (refreshToken) {
      this.storage.setItem('refreshToken', refreshToken);
    }

    const _refreshToken = this.storage.getItem('refreshToken');

    // this.config = { ...this.authConfig.verify };
    // this.redirectUri = new URL(`${this.authConfig.webserverUrl}${this.config.redirectSlug}`);

    return (this.authenticated = this.api.get<User>(`${this.authConfig.apiUrl}/user/me`).pipe(
      switchMap(response => {
        const user = response;

        const afObs = observableOf({ firebaseToken: undefined, firebaseUser: undefined });

        return observableCombineLatest(observableOf({ token, _refreshToken, user }), afObs);
      }),
      map((values: any) => ({
        token: values[0].token,
        refreshToken: values[0].refreshToken,
        user: values[0].user
      }))
    ));
  }

  @DebugLog initFromLocalStore(): Observable<Auth> {
    const token = this.storage.getItem('token');
    const refreshToken = this.storage.getItem('refreshToken');

    if (token) {
      return this.init(token, refreshToken);
    } else {
      this.store.dispatch(new Actions.LoginSuccess(undefined));

      return throwError({});
    }
  }

  @DebugLog refreshToken(): Observable<Auth> {
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

  @DebugLog getFirebaseToken(): Observable<object | null> {
    return this.api.get(`${this.authConfig.apiUrl}/auth/firebase/token`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return observableOf(undefined);
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
  verify(token: string, uid: string): Observable<Auth> {
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
