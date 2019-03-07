import { TestBed } from '@angular/core/testing';

import { LocalizeSelectors } from '../../../store';
import { DescriptionLanguageListService } from '../';
import { Observable, of } from 'rxjs';
import { LocalizationState } from '@bit/garlictech.angular-features.common.localization';
import { LocalizedItem, TextualDescription } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

describe('DescriptionLanguageListService', () => {
  let state = {
    actualLanguage: 'en_US',
    descriptionLanguageList: ['en_US']
  };

  let item: LocalizedItem<TextualDescription>;

  class FakeLocalizeSelectors {
    getCurrentLanguage(): Observable<string> {
      return of(state.actualLanguage);
    }

    getDescriptionLanguageList(): Observable<string[]> {
      return of(state.descriptionLanguageList);
    }

    getLanguageSettings(): Observable<LocalizationState> {
      return of({
        actualLanguage: state.actualLanguage,
        descriptionLanguageList: state.descriptionLanguageList
      });
    }
  }

  beforeEach(() => {
    item = {
      de_DE: {
        title: 'german'
      },
      hu_HU: {
        title: 'hungarian'
      },
      en_US: {
        title: 'english'
      }
    };

    state = {
      actualLanguage: 'en_US',
      descriptionLanguageList: ['hu_HU', 'es_ES']
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocalizeSelectors,
          useClass: FakeLocalizeSelectors
        },
        DescriptionLanguageListService
      ]
    });
  });

  xit('should return the first matching language', async () => {
    const service: DescriptionLanguageListService = TestBed.get(DescriptionLanguageListService);
    const transformed = await service.getLocalizedDescription(item).toPromise();

    expect(transformed.title).toEqual(item.hu_HU.title);
  });

  it('should fallback to the interface language when no matching language found', async () => {
    delete item.hu_HU;

    const service: DescriptionLanguageListService = TestBed.get(DescriptionLanguageListService);
    const transformed = await service.getLocalizedDescription(item).toPromise();

    expect(transformed.title).toEqual(item.en_US.title);
  });

  it('should use the first language if no language found', async () => {
    state.descriptionLanguageList = [];
    state.actualLanguage = 'ru_RU';

    const service: DescriptionLanguageListService = TestBed.get(DescriptionLanguageListService);
    const transformed = await service.getLocalizedDescription(item).toPromise();

    expect(transformed.title).toEqual(item.de_DE.title);
  });

  it("should fallback to en_US when we can't find anything", async () => {
    state.actualLanguage = 'ru_RU';

    item = {
      en_US: item.en_US
    };

    const service: DescriptionLanguageListService = TestBed.get(DescriptionLanguageListService);
    const transformed = await service.getLocalizedDescription(item).toPromise();

    expect(transformed.title).toEqual(item.en_US.title);
  });
});
