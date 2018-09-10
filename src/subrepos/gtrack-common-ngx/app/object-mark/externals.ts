import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export interface IExternalObjectMarkDependencies {
  storeDomain: string;
}

export const EXTERNAL_OBJECT_MARK_DEPENDENCIES = new InjectionToken<IExternalObjectMarkDependencies>(
  'IExternalObjectMarkDependencies'
);
