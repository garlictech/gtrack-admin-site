import { InjectionToken } from '@angular/core';

export interface ExternalObjectMarkDependencies {
  storeDomain: string;
}

export const EXTERNAL_OBJECT_MARK_DEPENDENCIES = new InjectionToken<ExternalObjectMarkDependencies>(
  'IExternalObjectMarkDependencies'
);
