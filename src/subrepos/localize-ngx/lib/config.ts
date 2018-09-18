import { InjectionToken } from '@angular/core';

export interface ILocalizeConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
}

export const defaultLocalizeConfig: ILocalizeConfig = {
  defaultLanguage: 'en_US',
  supportedLanguages: ['en_US']
};

export const CONFIG = new InjectionToken<ILocalizeConfig>('Config');
