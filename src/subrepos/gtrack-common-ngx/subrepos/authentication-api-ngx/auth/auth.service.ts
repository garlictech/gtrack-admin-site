import { Injectable, Optional } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Store } from '@ngrx/store';

import { LocalStorage } from '../storage/local-storage.service';
import { User } from '../';
import { IAuth } from '../store';
import * as Actions from '../store/actions';
import { AuthenticationApiConfig } from '../lib/config';
import { ApiService } from '../api';
import { DebugLog } from '../log';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  authenticated: Promise<IAuth>;

  private redirectUri: URL;

  private config: {
    redirectSlug: string;
  };

  constructor(
    private api: ApiService,
    private storage: LocalStorage,
    private authConfig: AuthenticationApiConfig,
    private http: Http,
    private store: Store<any>,
    @Optional() private afAuth: AngularFireAuth
  ) {
    this.authenticated = this.initFromLocalStore();
  }

  @DebugLog
  init(token: string, refreshToken?: string | null): Promise<IAuth> {
    this.storage.setItem('token', token);

    if (refreshToken) {
      this.storage.setItem('refreshToken', refreshToken);
    }

    refreshToken = this.storage.getItem('refreshToken');

    this.config = { ...this.authConfig.verify };
    this.redirectUri = new URL(`${this.authConfig.webserverUrl}${this.config.redirectSlug}`);

    return (this.authenticated = this.api
      .get(`${this.authConfig.apiUrl}/user/me`)
      .switchMap(response => {
        let user = <User>response.json();

        this.api.on('unauthorized', () => {
          this.store.dispatch(new Actions.Unauthorized());
        });

        let afObs = this.afAuth ? this._getFirebaseData() : Observable.of({ firebaseToken: null, firebaseUser: null });

        return Observable.combineLatest(Observable.of({ token, refreshToken, user }), afObs);
      })
      .map(values => {
        let auth: IAuth = {
          token: values[0].token,
          refreshToken: values[0].refreshToken,
          user: values[0].user,
          firebaseToken: values[1].firebaseToken,
          firebaseUser: values[1].firebaseUser || undefined
        };

        return auth;
      })
      .toPromise());
  }

  @DebugLog
  private _getFirebaseData(): Observable<{ firebaseToken: string | null; firebaseUser: firebase.User | null }> {
    return Observable.fromPromise(this.getFirebaseToken())
      .switchMap(response => {
        let body: string | null = response && response.text();
        let firebaseToken: string | null = null;

        if (body) {
          firebaseToken = body.replace(/"/g, '');
        }

        let firebaseUser = firebaseToken
          ? Observable.fromPromise(this.afAuth.auth.signInWithCustomToken(firebaseToken))
          : Observable.empty();

        return Observable.combineLatest(Observable.of(firebaseToken), firebaseUser);
      })
      .map(values => {
        return { firebaseToken: values[0], firebaseUser: values[1] };
      });
  }

  @DebugLog
  initFromLocalStore() {
    let token = this.storage.getItem('token');
    let refreshToken = this.storage.getItem('refreshToken');
    return token ? this.init(token, refreshToken) : Promise.reject({});
  }

  @DebugLog
  refreshToken(): Promise<IAuth> {
    let refreshToken = this.storage.getItem('refreshToken');

    if (!refreshToken) {
      return Promise.reject(new Error('Missing refresh token'));
    }

    let params = new URLSearchParams();
    params.set('refreshToken', refreshToken);

    return this.http
      .get(`${this.authConfig.apiUrl}/auth/token`, {
        search: params
      })
      .toPromise()
      .then((response: Response) => {
        let body = response.json();
        let token = body.token;

        return this.init(token);
      });
  }

  @DebugLog
  destroyRefreshToken(): Promise<Response | void> {
    let refreshToken = this.storage.getItem('refreshToken');

    if (!refreshToken) {
      return Promise.resolve();
    }

    return this.http.delete(`${this.authConfig.apiUrl}/auth/token/${refreshToken}`).toPromise();
  }

  @DebugLog
  logout(): Promise<any> {
    this.storage.removeItem('token');

    return this.destroyRefreshToken()
      .then(() => this.storage.removeItem('refreshToken'))
      .then(() => (this.afAuth ? this.afAuth.auth.signOut() : Promise.resolve()));
  }

  @DebugLog
  getFirebaseToken(): Promise<Response | null> {
    return this.api
      .get(`${this.authConfig.apiUrl}/auth/firebase/token`)
      .toPromise()
      .catch((err: Error | Response) => {
        if (err instanceof Response && err.status === 404) {
          return Promise.resolve(null);
        }

        return Promise.reject(err);
      });
  }

  /**
   * Request new verify token
   */
  public requestVerifyToken(email: String): Promise<any> {
    let tokenRequestUrl = `${this.authConfig.apiUrl}/auth/verify/request`;

    return this.api
      .post(tokenRequestUrl, {
        email: email,
        redirectUri: this.redirectUri.toString()
      })
      .toPromise();
  }

  /**
   * Verify user by token
   */
  public verify(token: String, uid: String): Promise<IAuth> {
    let verifyUrl = `${this.authConfig.apiUrl}/auth/verify`;

    return this.api
      .post(verifyUrl, {
        token: token,
        uid: uid
      })
      .toPromise()
      .then((response: Response) => {
        let body = response.json();
        let responseToken = body.token;

        return this.init(responseToken);
      });
  }
}
