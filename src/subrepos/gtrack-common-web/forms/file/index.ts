import { AfterViewInit, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { faCheck, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { FileComponent as NativeFileComponent } from '@features/common/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable no-forward-ref
  // tslint:disable no-use-before-declare
  useExisting: forwardRef(() => FileComponent),
  // tslint:enable no-forward-ref
  // tslint:enable no-use-before-declare
  multi: true
};

@Component({
  selector: 'gtrack-form-file',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class FileComponent extends NativeFileComponent implements AfterViewInit {
  mode: string;
  icon: IconDefinition;

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.mode = this.isBasic ? 'basic' : 'advanced';
    this.icon = faCheck;
  }
}
