# deepstream ngx

[![Build Status](https://travis-ci.org/garlictech/deepstream-ngx.svg?branch=master)](https://travis-ci.org/garlictech/deepstream-ngx)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repo contains all the deepstream related functionalities:

- It defines a service to log in/out to deepstream, and access deepstream-rxjs records, queries, etc.
- It also reacts to JWT logins: there are effects reacting to the `LOGIN_SUCCESS` and `LOGOUT_SUCCESS` events from the JWT authentication. After such actions, the service executes the appropriate Deepstream logins/logouts. The concept: you log in and obtain a JWT token. Using that token, you execute a deepstream login/logout as well. When both logins are OK, then you consider your application logged in. If any of the logins fail, take the whole login process failed.

The payload of the JWT login must contain a jwt token, like:

```
interface IAuth {
  ...
  token: string;
}
```

## How to integrate it into an Angular project

Create a module like this (extracted from a real project)

```
import { NgModule } from '@angular/core';

import {
  DeepstreamModule as CoreDeepstreamModule,
  IExternalDeepstreamDependencies,
  EXTERNAL_DEEPSTREAM_DEPENDENCIES
} from '../../subrepos/deepstream-ngx';

import { environment } from '../../environments/environment';

import { Actions as JwtActions } from '../../subrepos/authentication-api-ngx';

let externalDeepstreamDependencies: IExternalDeepstreamDependencies = {
  deepstreamConnectionString: environment.deepstream,
  JwtApiActions: {
    LOGIN_SUCCESS: JwtActions.LOGIN_SUCCESS,
    LOGOUT_START: JwtActions.LOGOUT_START
  }
};

@NgModule({
  imports: [CoreDeepstreamModule],
  providers: [{ provide: EXTERNAL_DEEPSTREAM_DEPENDENCIES, useValue: externalDeepstreamDependencies }]
})
export class DeepstreamModule {}

export { Reducer, IDeepstreamState, DeepstreamService } from '../../subrepos/deepstream-ngx';
```

We assume that you use the ```authentication-api-ngx```, however, any JWT login/logout lib works if you can implement `EXTERNAL_DEEPSTREAM_DEPENDENCIES` on top of that.

Then, add the deepstream reducer and state to your global store:

```
const reducer = {
  authentication: AuthenticationReducer,
  deepstream: DeepstreamReducer,
  ...
};

export const store = NgrxStoreModule.forRoot(compose(storeLogger(), combineReducers)(reducer));

export interface State {
  authentication: IAuthenticationState;
  deepstream: IDeepstreamState;
  ...
}
```

So, the core of the implementation is implementing the `EXTERNAL_DEEPSTREAM_DEPENDENCIES` injection token, according to `IExternalDeepstreamDependencies`.

Then, use selectors to define if the application is logged in or logged out. Example selectors from a real project:

```
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { State } from '../../store';

@Injectable()
export class Selectors {
  constructor(private _store: Store<State>) {}

  ...

  isLoggingIn(): Observable<boolean> {
    return this._store.select(
      s => _.get(s, 'authentication.loggingIn') || _.get(s, 'deepstream.state') === 'loggingIn'
    );
  }

  isFailed() {
    return this._store.select(
      s => !!_.get(s, 'authentication.failed') || _.get(s, 'deepstream.state') === 'loginFailed'
    );
  }

  isLoggedOut() {
    return this._store.select(s => !_.get(s, 'authentication.auth.user'));
  }

  isLoggedIn(): Observable<boolean> {
    return this._store.select(
      s => _.get(s, 'authentication.auth.token') && _.get(s, 'deepstream.state') === 'loggedIn'
    );
  }
}

```
