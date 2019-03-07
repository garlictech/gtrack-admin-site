import { Injectable } from '@angular/core';
import { LocalizedItem, TextualDescription } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import _get from 'lodash-es/get';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalizeSelectors } from '../../store/selectors';

@Injectable()
export class DescriptionLanguageListService {
  private readonly _fallbackLanguage: string;

  constructor(private readonly _selectors: LocalizeSelectors) {
    this._fallbackLanguage = 'en_US';
  }

  getLocalizedDescription(item: LocalizedItem<TextualDescription> | undefined): Observable<TextualDescription> {
    if (!item) {
      return observableOf({
        title: ''
      });
    }

    return this._selectors.getLanguageSettings().pipe(
      map(settings => {
        const list = [
          // ...settings.descriptionLanguageList,
          settings.actualLanguage
        ];

        const firstLanguage = Object.keys(item)[0];

        if (firstLanguage) {
          list.push(firstLanguage);
        }

        list.push(this._fallbackLanguage);

        const preferredLanguage = list.find(language => typeof item[language] !== 'undefined');

        return _get(item, preferredLanguage, {
          title: ''
        });
      })
    );
  }
}
