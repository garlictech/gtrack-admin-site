import {
  Component, Input, Provider, forwardRef, AfterViewInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as $ from 'jquery';

require('emojionearea'); // tslint:disable-line:no-var-requires

import { AbstractValueAccessor } from '../abstract-value-accessor';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable no-forward-ref
  useExisting: forwardRef(() => EmojiInputComponent),
  // tslint:enable no-forward-ref
  multi: true
};

@Component({
  selector: 'app-form-emoji-input',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
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
  }

  public refreshModel() {
    this.value = $(this.emojiArea.nativeElement)
      .data('emojioneArea')
      .getText();
  }
}
