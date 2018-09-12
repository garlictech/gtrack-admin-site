import { Injectable } from '@angular/core';
import { ILocalizedItem, ITextualDescription } from '../../../../../provider-client';
import { LocalizeSelectors } from '../../store/selectors';

import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class DescriptionLanguageListService {
  private _fallbackLanguage = 'en_US';

  constructor(private _selectors: LocalizeSelectors) {}

  public getLocalizedDescription(
    item: ILocalizedItem<ITextualDescription> | undefined
  ): Observable<ITextualDescription> {
    if (!item) {
      return Observable.of({
        title: ''
      });
    }

    return this._selectors.getLanguageSettings().map(settings => {
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

      const preferredItem = _.get(item, preferredLanguage, {
        title: ''
      });

      return preferredItem;
    });
  }
}
