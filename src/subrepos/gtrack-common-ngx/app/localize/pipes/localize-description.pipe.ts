import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ILocalizedItem, ITextualDescription } from '../../../../provider-client';
import { Subscription } from 'rxjs';

import { DescriptionLanguageListService } from '../services';

import _merge from 'lodash-es/merge';

@Pipe({
  name: 'localizeDescription',
  pure: false
})
export class LocalizeDescriptionPipe implements PipeTransform, OnDestroy {
  private _valueChange: Subscription;
  private _value: ITextualDescription;

  constructor(private _ref: ChangeDetectorRef, private _descriptionLanguageList: DescriptionLanguageListService) {}

  transform(value: ILocalizedItem<ITextualDescription>): ITextualDescription {
    this._dispose();

    if (!this._valueChange) {
      this._valueChange = this._descriptionLanguageList.getLocalizedDescription(value).subscribe(localized => {
        this._updateValue(localized);
      });
    }

    return this._value;
  }

  ngOnDestroy() {
    this._dispose();
  }

  private _updateValue(transformed: ITextualDescription): void {
    const defaults: ITextualDescription = {
      title: '',
      fullDescription: '',
      summary: ''
    };

    const merged: ITextualDescription = _merge({}, defaults, transformed);

    this._value = merged;
    this._ref.markForCheck();
  }

  private _dispose(): void {
    if (typeof this._valueChange !== 'undefined') {
      this._valueChange.unsubscribe();
      this._valueChange = undefined;
    }
  }
}
