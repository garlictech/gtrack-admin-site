import { Component, forwardRef, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';

import { FileComponent as NativeFileComponent } from 'subrepos/forms-ngx';

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
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class FileComponent extends NativeFileComponent implements AfterViewInit {
  mode: string;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.mode = this.isBasic ? 'basic' : 'advanced';
  }
}
