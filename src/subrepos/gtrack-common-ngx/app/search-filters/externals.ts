import { InjectionToken } from '@angular/core';

export interface ExternalSearchFiltersDependencies {
  storeDomain: string;
}

export const EXTERNAL_SEARCH_FILTERS_DEPENDENCIES = new InjectionToken<ExternalSearchFiltersDependencies>(
  'IExternalSearchFiltersDependencies'
);
