import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { LocalizedItem, TextualDescription } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Subscription } from 'rxjs';

import { DescriptionLanguageListService } from '../services';

import _merge from 'lodash-es/merge';

@Pipe({
  name: 'localizeDescription',
  // tslint:disable-next-line:pipe-impure // TODO fix
  pure: false
})
export class LocalizeDescriptionPipe implements PipeTransform, OnDestroy {
  private _valueChange: Subscription;
  private _value: TextualDescription;

  constructor(
    private readonly _ref: ChangeDetectorRef,
    private readonly _descriptionLanguageList: DescriptionLanguageListService
  ) {}

  transform(value: LocalizedItem<TextualDescription>): TextualDescription {
    this._dispose();

    if (!this._valueChange) {
      this._valueChange = this._descriptionLanguageList.getLocalizedDescription(value).subscribe(localized => {
        this._updateValue(localized);
      });
    }

    return this._value;
  }

  ngOnDestroy(): void {
    this._dispose();
  }

  private _updateValue(transformed: TextualDescription): void {
    const defaults: TextualDescription = {
      title: '',
      fullDescription: '',
      summary: ''
    };

    const merged: TextualDescription = _merge({}, defaults, transformed);

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
