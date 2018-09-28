import { InjectionToken } from '@angular/core';

export interface IExternalPoiDependencies {
  storeDomain: string;
}

export const EXTERNAL_POI_DEPENDENCIES = new InjectionToken<IExternalPoiDependencies>('IExternalPoiDependencies');
