import { InjectionToken } from '@angular/core';
import { Action } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store/src/selector';

export interface IExternalDeepstreamDependencies {
  deepstreamConnectionString: string;
  JwtApiActions: {
    LOGIN_SUCCESS: string;
    LOGOUT_START: string;
  };

  selectors: {
    getUserId: MemoizedSelector<any, string | undefined>;
    getUserRole: MemoizedSelector<any, string>;
  };

  storeDomain: string;
}
export const EXTERNAL_DEEPSTREAM_DEPENDENCIES = new InjectionToken<IExternalDeepstreamDependencies>(
  'ExternalDeepstreamDependencies'
);
