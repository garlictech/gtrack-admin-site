import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export interface IExternalPoiDependencies {
  storeDomain: string;
}

export const EXTERNAL_POI_DEPENDENCIES = new InjectionToken<IExternalPoiDependencies>('IExternalPoiDependencies');
