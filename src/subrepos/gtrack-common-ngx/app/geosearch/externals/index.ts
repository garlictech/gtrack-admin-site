import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export interface IExternalGeoSearchDependencies {
  storeDomain: string;
}

export const EXTERNAL_GEO_SEARCH_DEPENDENCIES = new InjectionToken<IExternalGeoSearchDependencies>(
  'IExternalGeoSearchDependencies'
);
