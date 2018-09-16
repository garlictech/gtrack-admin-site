import { takeUntil, map } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { AbstractValueAccessor } from '../abstract-value-accessor';
import { IUploadOptions } from '../field';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-form-file',
  template: ''
})
export class FileComponent extends AbstractValueAccessor implements OnInit, OnDestroy {
  @Input()
  uploadOptions: IUploadOptions;
  @Input()
  isBasic;
  @Input()
  placeholder;
  uploaded$: Observable<boolean>;
  protected _destroy$ = new Subject<boolean>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.uploaded$ = this.uploadOptions.fileUri$.pipe(map(uri => !!uri));
    this.uploadOptions.fileUri$.pipe(takeUntil(this._destroy$)).subscribe(uri => (this.value = uri));
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
