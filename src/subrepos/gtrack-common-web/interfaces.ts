import { InjectionToken } from '@angular/core';
import { LocalizeConfig } from '@bit/garlictech.angular-features.common.localization';

export interface Config {
  language: LocalizeConfig;
}

export const CONFIG = new InjectionToken<Config>('Config');
