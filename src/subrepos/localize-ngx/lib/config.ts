export interface ILocalizeConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
}

export const defaultLocalizeConfig: ILocalizeConfig = {
  defaultLanguage: 'en_US',
  supportedLanguages: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'ru_RU', 'pt_PT', 'ro_RO']
};
