import { InjectionToken } from '@angular/core';

export interface IExternalHikeDependencies {
  storeDomain: string;
}

export const EXTERNAL_HIKE_DEPENDENCIES = new InjectionToken<IExternalHikeDependencies>('IExternalHikeDependencies');
