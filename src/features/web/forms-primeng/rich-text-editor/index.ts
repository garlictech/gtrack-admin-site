import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { RichTextEditorComponent as NativeComponent } from '@bit/garlictech.angular-features.common.forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable no-forward-ref
  // tslint:disable no-use-before-declare
  useExisting: forwardRef(() => RichTextEditorComponent),
  // tslint:enable no-forward-ref
  // tslint:enable no-use-before-declare
  multi: true
};

@Component({
  selector: 'gtrack-form-rich-text-editor',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class RichTextEditorComponent extends NativeComponent {}
