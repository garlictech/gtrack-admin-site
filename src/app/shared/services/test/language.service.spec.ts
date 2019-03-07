import { TestBed } from '@angular/core/testing';

import { AdminLanguageService } from '../language.service';

describe('AdminLanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminLanguageService]
    });
  });

  it('should get descriptionLanguages', () => {
    const langs = AdminLanguageService.descriptionLanguages;

    expect(langs).toEqual({
      en_US: 'English',
      hu_HU: 'Hungarian',
      de_DE: 'German',
      fr_FR: 'French',
      it_IT: 'Italian'
    });
  });

  it('should call shortToLocale', () => {
    const localEN = AdminLanguageService.shortToLocale('en');
    const localHU = AdminLanguageService.shortToLocale('hu');
    const localDE = AdminLanguageService.shortToLocale('de');
    const localFR = AdminLanguageService.shortToLocale('fr');
    const localIT = AdminLanguageService.shortToLocale('it');
    const noLocal = AdminLanguageService.shortToLocale('fakeLang');

    expect(localEN).toEqual('en_US');
    expect(localHU).toEqual('hu_HU');
    expect(localDE).toEqual('de_DE');
    expect(localFR).toEqual('fr_FR');
    expect(localIT).toEqual('it_IT');
    expect(noLocal).toEqual('fakeLang');
  });

  it('should call localeToName', () => {
    const nameEN = AdminLanguageService.localeToName('en_US');
    const nameHU = AdminLanguageService.localeToName('hu_HU');
    const nameDE = AdminLanguageService.localeToName('de_DE');
    const nameFR = AdminLanguageService.localeToName('fr_FR');
    const nameIT = AdminLanguageService.localeToName('it_IT');
    const noLocal = AdminLanguageService.localeToName('fakeLocale');

    expect(nameEN).toEqual('English');
    expect(nameHU).toEqual('Hungarian');
    expect(nameDE).toEqual('German');
    expect(nameFR).toEqual('French');
    expect(nameIT).toEqual('Italian');
    expect(noLocal).toEqual('fakeLocale');
  });

  it('should call pascalize', () => {
    const expected1 = AdminLanguageService.pascalize('one_more thing');
    const expected2 = AdminLanguageService.pascalize('his name_is Bob');

    expect(expected1).toEqual('One more thing');
    expect(expected2).toEqual('His name is Bob');
  });
});
