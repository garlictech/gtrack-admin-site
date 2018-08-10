import { Injectable } from '@angular/core';
import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

interface ILngObject {
  locale: string;
  short: string;
  name: string;
}

export const DESCRIPTION_LANGUAGES: ILngObject[] = [
  { locale: 'en_US', short: 'en', name: 'English' },
  { locale: 'hu_HU', short: 'hu', name: 'Hungarian' },
  { locale: 'de_DE', short: 'de', name: 'German' },
  { locale: 'fr_FR', short: 'fr', name: 'French' },
  { locale: 'it_IT', short: 'it', name: 'Italian' }
]

@Injectable()
export class LanguageService {
  public static get descriptionLanguages() {
    return {
      en_US: 'English',
      hu_HU: 'Hungarian',
      de_DE: 'German',
      fr_FR: 'French',
      it_IT: 'Italian'
    };
  }

  public static shortToLocale(lng: string) {
    const _lang = DESCRIPTION_LANGUAGES.find(lang => lang.short === lng);
    return _lang ? _lang.locale : lng;
  }

  public static localeToName(locale: string) {
    const _lang = DESCRIPTION_LANGUAGES.find(lang => lang.locale === locale);
    return _lang ? _lang.name : locale;
  }
}
