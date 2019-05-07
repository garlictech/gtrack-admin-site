import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export interface ExternalDeepstreamDependencies {
  deepstreamConnectionString: string;

  selectors: {
    getUserId: MemoizedSelector<any, string | undefined>;
    getUserRole: MemoizedSelector<any, string>;
  };
}

export const EXTERNAL_DEEPSTREAM_DEPENDENCIES = new InjectionToken<ExternalDeepstreamDependencies>(
  'ExternalDeepstreamDependencies'
);
