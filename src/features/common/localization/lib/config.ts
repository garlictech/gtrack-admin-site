import { InjectionToken } from '@angular/core';

export interface LocalizeConfig {
  defaultLanguage: string;
  supportedLanguages: Array<string>;
}

export const defaultLocalizeConfig: LocalizeConfig = {
  defaultLanguage: 'en_US',
  supportedLanguages: ['en_US']
};

export const CONFIG = new InjectionToken<LocalizeConfig>('Config');
