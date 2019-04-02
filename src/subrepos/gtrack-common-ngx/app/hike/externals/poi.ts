import { InjectionToken } from '@angular/core';

export interface ExternalPoiDependencies {
  storeDomain: string;
}

export const EXTERNAL_POI_DEPENDENCIES = new InjectionToken<ExternalPoiDependencies>('ExternalPoiDependencies');
