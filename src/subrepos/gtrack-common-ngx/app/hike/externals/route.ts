import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export interface IExternalRouteDependencies {
  storeDomain: string;
}

export const EXTERNAL_ROUTE_DEPENDENCIES = new InjectionToken<IExternalRouteDependencies>(
  'IExternalRouteDependencies'
);
