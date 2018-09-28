import { InjectionToken } from '@angular/core';
import { ILocalizeConfig } from 'subrepos/localize-ngx';

export interface IConfig {
  language: ILocalizeConfig;
}

export const CONFIG = new InjectionToken<IConfig>('Config');
