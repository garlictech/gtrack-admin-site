import _isEqual from 'lodash-es/isEqual';
import _isFunction from 'lodash-es/isFunction';
import _pick from 'lodash-es/pick';

import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { FormArray } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { DebugLog, log } from 'app/log';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FormDescriptor } from '../field';
import { FieldControlService, FormInstance } from '../field-control-service';

const _validateForm = (form: any) => {
  Object.keys(form.controls).forEach(field => {
    const control = form.get(field);
    if (control instanceof FormArray) {
      control.controls.forEach(_validateForm);
    } else if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  });
};

@Component({
  selector: 'app-native-form',
  moduleId: module.id,
  template: ''
})
export class DynamicFormComponent implements AfterViewInit, OnDestroy {
  @Input() formDescriptor: FormDescriptor;

  formInstance: FormInstance;

  protected readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _fcs: FieldControlService,
    private readonly _store: Store<any>,
    private readonly _cdr: ChangeDetectorRef
  ) {
    this._destroy$ = new Subject<boolean>();
  }

  @DebugLog ngAfterViewInit(): void {
    this.formInstance = this._fcs.toFormGroup(this.formDescriptor.fields, {});
    this._cdr.detectChanges();

    if (this.formDescriptor.formDataSelector) {
      this._store
        .pipe(
          select(this.formDescriptor.formDataSelector),
          takeUntil(this._destroy$),
          filter(formData => !!formData),
          map(formData => {
            const fieldKeys = Object.keys(this.formDescriptor.fields);

            return _pick(formData, fieldKeys);
          }),
          distinctUntilChanged(_isEqual) // We don't need to patch the form when the value is not changed
        )
        .subscribe(formData => {
          this.formInstance.form.patchValue(formData);
          this._cdr.detectChanges();
        });
    }
  }

  onSubmit(e?: Event): void {
    if (e) {
      e.preventDefault();
    }

    if (this.formInstance.form.valid) {
      this.formDescriptor.submit.submitFv(this.formInstance.form);

      if (!!this.formDescriptor.submit.resetOnSubmit) {
        this._resetForm();
      }
    } else {
      log.data('Form is invalid, not submitting.');
      _validateForm(this.formInstance.form);
    }
  }

  getOnSubmit(): () => void {
    return (): void => this.onSubmit();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  private _resetForm(): void {
    this.formInstance = _isFunction(this.formDescriptor.submit.resetFv)
      ? this.formDescriptor.submit.resetFv(this.formDescriptor)
      : this._fcs.toFormGroup(this.formDescriptor.fields, {});
    this._cdr.detectChanges();
  }
}
