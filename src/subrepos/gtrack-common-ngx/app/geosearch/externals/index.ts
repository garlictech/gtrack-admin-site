import { InjectionToken } from '@angular/core';

export interface ExternalGeoSearchDependencies {
  storeDomain: string;
}

export const EXTERNAL_GEO_SEARCH_DEPENDENCIES = new InjectionToken<ExternalGeoSearchDependencies>(
  'IExternalGeoSearchDependencies'
);
