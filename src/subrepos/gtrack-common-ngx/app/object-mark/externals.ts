import { InjectionToken } from '@angular/core';

export interface IExternalObjectMarkDependencies {
  storeDomain: string;
}

export const EXTERNAL_OBJECT_MARK_DEPENDENCIES = new InjectionToken<IExternalObjectMarkDependencies>(
  'IExternalObjectMarkDependencies'
);
