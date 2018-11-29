import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageService
      ]
    });
  });

  it('should get descriptionLanguages', () => {
    const langs = LanguageService.descriptionLanguages;

    expect(langs).toEqual({
      en_US: 'English',
      hu_HU: 'Hungarian',
      de_DE: 'German',
      fr_FR: 'French',
      it_IT: 'Italian'
    });
  });

  it('should call shortToLocale', () => {
    const localEN = LanguageService.shortToLocale('en');
    const localHU = LanguageService.shortToLocale('hu');
    const localDE = LanguageService.shortToLocale('de');
    const localFR = LanguageService.shortToLocale('fr');
    const localIT = LanguageService.shortToLocale('it');
    const noLocal = LanguageService.shortToLocale('fakeLang');

    expect(localEN).toEqual('en_US');
    expect(localHU).toEqual('hu_HU');
    expect(localDE).toEqual('de_DE');
    expect(localFR).toEqual('fr_FR');
    expect(localIT).toEqual('it_IT');
    expect(noLocal).toEqual('fakeLang');
  });

  it('should call localeToName', () => {
    const nameEN = LanguageService.localeToName('en_US');
    const nameHU = LanguageService.localeToName('hu_HU');
    const nameDE = LanguageService.localeToName('de_DE');
    const nameFR = LanguageService.localeToName('fr_FR');
    const nameIT = LanguageService.localeToName('it_IT');
    const noLocal = LanguageService.localeToName('fakeLocale');

    expect(nameEN).toEqual('English');
    expect(nameHU).toEqual('Hungarian');
    expect(nameDE).toEqual('German');
    expect(nameFR).toEqual('French');
    expect(nameIT).toEqual('Italian');
    expect(noLocal).toEqual('fakeLocale');
  });

  it('should call pascalize', () => {
    const expected1 = LanguageService.pascalize('one_more thing');
    const expected2 = LanguageService.pascalize('his name_is Bob');

    expect(expected1).toEqual('One more thing');
    expect(expected2).toEqual('His name is Bob');
  });
});
