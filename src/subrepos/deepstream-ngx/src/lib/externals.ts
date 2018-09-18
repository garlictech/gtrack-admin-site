import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export interface IExternalDeepstreamDependencies {
  deepstreamConnectionString: string;

  selectors: {
    getUserId: MemoizedSelector<any, string | undefined>;
    getUserRole: MemoizedSelector<any, string>;
  };

  storeDomain: string;
}
export const EXTERNAL_DEEPSTREAM_DEPENDENCIES = new InjectionToken<IExternalDeepstreamDependencies>(
  'ExternalDeepstreamDependencies'
);
