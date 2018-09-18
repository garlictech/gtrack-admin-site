import { InjectionToken } from '@angular/core';

export interface IExternalRouteDependencies {
  storeDomain: string;
}

export const EXTERNAL_ROUTE_DEPENDENCIES = new InjectionToken<IExternalRouteDependencies>('IExternalRouteDependencies');
