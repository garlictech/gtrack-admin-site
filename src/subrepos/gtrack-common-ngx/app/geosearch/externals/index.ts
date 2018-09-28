import { InjectionToken } from '@angular/core';

export interface IExternalGeoSearchDependencies {
  storeDomain: string;
}

export const EXTERNAL_GEO_SEARCH_DEPENDENCIES = new InjectionToken<IExternalGeoSearchDependencies>(
  'IExternalGeoSearchDependencies'
);
