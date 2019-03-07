import { InjectionToken } from '@angular/core';

export interface ExternalHikeDependencies {
  storeDomain: string;
}

export const EXTERNAL_HIKE_DEPENDENCIES = new InjectionToken<ExternalHikeDependencies>('ExternalHikeDependencies');
