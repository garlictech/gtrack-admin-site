import { InjectionToken } from '@angular/core';
import { Action } from '@ngrx/store';

export interface IExternalDeepstreamDependencies {
  deepstreamConnectionString: string;
  JwtApiActions: {
    LOGIN_SUCCESS: string;
    LOGOUT_START: string;
  };
}
export const EXTERNAL_DEEPSTREAM_DEPENDENCIES = new InjectionToken<IExternalDeepstreamDependencies>(
  'ExternalDeepstreamDependencies'
);
