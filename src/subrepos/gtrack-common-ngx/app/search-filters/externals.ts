import { InjectionToken } from '@angular/core';

export interface IExternalSearchFiltersDependencies {
  storeDomain: string;
}

export const EXTERNAL_SEARCH_FILTERS_DEPENDENCIES = new InjectionToken<IExternalSearchFiltersDependencies>(
  'IExternalSearchFiltersDependencies'
);
