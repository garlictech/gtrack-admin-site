import { InjectionToken } from '@angular/core';

export interface ExternalRouteDependencies {
  storeDomain: string;
}

export const EXTERNAL_ROUTE_DEPENDENCIES = new InjectionToken<ExternalRouteDependencies>('ExternalRouteDependencies');
