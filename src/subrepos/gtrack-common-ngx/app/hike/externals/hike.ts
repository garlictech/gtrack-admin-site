import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export interface IExternalHikeDependencies {
  storeDomain: string;
}

export const EXTERNAL_HIKE_DEPENDENCIES = new InjectionToken<IExternalHikeDependencies>(
  'IExternalHikeDependencies'
);
