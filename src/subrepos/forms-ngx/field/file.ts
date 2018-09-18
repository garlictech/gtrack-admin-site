import { ValidatorFn } from '@angular/forms';
import { Field, IField } from './field';
import { Observable } from 'rxjs';

export interface IUploadOptions {
  uploadHandler: (event: any) => void;
  uploading$: Observable<boolean>;
  fileUri$: Observable<string>;
}

export interface IFile extends IField<File> {
  uploadOptions: IUploadOptions;
  isBasic?: boolean;
  fileId?: string;
  mimeType?: string;
}

export class FileField extends Field<File> implements IFile {
  controlType = 'file';
  fileId?: string;
  mimeType: string;
  isBasic: boolean;
  uploadOptions: IUploadOptions;

  constructor(options: IFile) {
    super(options);
    this.fileId = options.fileId;
    this.mimeType = options.mimeType || 'image/*';
    this.isBasic = options.isBasic || false;
    this.uploadOptions = { ...options.uploadOptions };

    (<ValidatorFn[]>this.validators).push(control => {
      return control.value === 'error' ? { uploadError: false } : null;
    });
  }
}
