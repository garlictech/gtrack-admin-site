<<<<<<< HEAD
import { of as observableOf, Observable } from 'rxjs';
=======
import { of as observableOf,  Observable } from 'rxjs';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ILocalizedItem, ITextualDescription } from '../../../../../provider-client';
import { LocalizeSelectors } from '../../store/selectors';
<<<<<<< HEAD

import _get from 'lodash-es/get';
=======
import * as _ from 'lodash';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

@Injectable()
export class DescriptionLanguageListService {
  private _fallbackLanguage = 'en_US';

  constructor(private _selectors: LocalizeSelectors) {}

  public getLocalizedDescription(
    item: ILocalizedItem<ITextualDescription> | undefined
  ): Observable<ITextualDescription> {
    if (!item) {
      return observableOf({
        title: ''
      });
    }

<<<<<<< HEAD
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

        const preferredItem = _get(item, preferredLanguage, {
          title: ''
        });

        return preferredItem;
      })
=======
    return this._selectors.getLanguageSettings()
      .pipe(
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

          const preferredItem = _.get(item, preferredLanguage, {
            title: ''
          });

          return preferredItem;
        })
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
    );
  }
}
