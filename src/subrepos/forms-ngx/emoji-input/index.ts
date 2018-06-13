import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';

require('emojionearea'); // tslint:disable-line:no-var-requires

import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-form-emoji-input',
  template: ''
})
export class EmojiInputComponent extends AbstractValueAccessor implements AfterViewInit {
  @Input() rows;
  @Input() placeholder?: string;
  @ViewChild('emojiArea') emojiArea;

  private _area;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this._area = (<any>$(this.emojiArea.nativeElement)).emojioneArea({
      autocomplete: false,
      hidePickerOnBlur: true,
      pickerPosition: 'bottom',
      events: {
        mouseup: (editor, event) => {
          this._area[0].emojioneArea.hidePicker();
        },
        change: (editor, event) => {
          this.refreshModel();
        },
        keyup: (editor, event) => {
          this.refreshModel();
        },
        emojibtn_click: (editor, event) => {
          this.refreshModel();
        }
      }
    });

    $(this.emojiArea.nativeElement)
      .data('emojioneArea')
      .setText(this.value || '');
  }

  public refreshModel() {
    this.value = $(this.emojiArea.nativeElement)
      .data('emojioneArea')
      .getText();
  }
}
