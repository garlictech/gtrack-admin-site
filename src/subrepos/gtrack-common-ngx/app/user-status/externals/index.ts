import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export interface IExternalUserStatusDependencies {
  storeDomain: string;
}

export const EXTERNAL_USER_STATUS_DEPENDENCIES = new InjectionToken<IExternalUserStatusDependencies>(
  'IExternalUserStatusDependencies'
);
