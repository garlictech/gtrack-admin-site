import { IConfig } from 'subrepos/gtrack-common-web/interfaces';

export const config: IConfig = {
  language: {
    defaultLanguage: 'en_US',
    supportedLanguages: ['en_US']
  }
};

export const SMALL_BUFFER_SIZE = 100;
export const BIG_BUFFER_SIZE = 1000;
