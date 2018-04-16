import { Field, IField } from './field';
import { Validators, ValidatorFn } from '@angular/forms';

export interface IFileUpload extends IField<File> {
  fileId?: string;
  type?: string;
}

export class FileUploadField extends Field<File> implements IFileUpload {
  controlType = 'file';
  fileId?: string;
  type = 'image/*';

  constructor(options: IFileUpload) {
    super(options);
    this.fileId = options.fileId;

    if (options.type) {
      this.type = options.type;
    }

    (<ValidatorFn[]>this.validators).push(control => {
      return control.value === 'error' ? { uploadError: false } : null;
    });
  }
}
