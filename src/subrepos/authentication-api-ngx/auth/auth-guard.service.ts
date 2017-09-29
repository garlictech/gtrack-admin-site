import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { log, DebugLog } from '../log';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  @DebugLog
  canActivate(): Observable<boolean> {
    return Observable.fromPromise(
      this.auth.authenticated.then(() => true).catch(() => false)
    );
  }
}
