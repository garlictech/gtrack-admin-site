export interface ILocalizeConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
}

export class LocalizeConfig implements ILocalizeConfig {
  defaultLanguage = 'en_US';
  supportedLanguages = ['en_US', 'de_DE', 'hu_HU', 'fr_FR', 'es_ES', 'ru_RU', 'pt_PT', 'ro_RO'];
}
