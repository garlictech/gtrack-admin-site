import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DestroyableComponent } from '@bit/garlictech.angular-features.common.utils';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import _get from 'lodash-es/get';
import _pick from 'lodash-es/pick';
import { filter, map, takeUntil } from 'rxjs/operators';
import { FormDescriptor } from '../field';
import { FieldControlService, FormInstance } from '../field-control-service';
import { DebugLog, log } from '../log';

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
export class DynamicFormComponent extends DestroyableComponent implements AfterViewInit, OnDestroy {
  @Input() formDescriptor: FormDescriptor;

  formInstance: FormInstance;

  constructor(
    private readonly _fcs: FieldControlService,
    private readonly _store: Store<any>,
    private readonly _cdr: ChangeDetectorRef
  ) {
    super();
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
          })
        )
        .subscribe(formData => {
          this.formInstance = this._fcs.toFormGroup(this.formDescriptor.fields, formData);
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

  getOnSubmit(): any {
    return (): void => this.onSubmit();
  }

  ngOnDestroy(): void {
    this._destroy();
  }
  private _resetForm(): void {
    this.formInstance = _.isFunction(this.formDescriptor.submit.resetFv)
      ? this.formDescriptor.submit.resetFv(this.formDescriptor)
      : this._fcs.toFormGroup(this.formDescriptor.fields, {});

    this._cdr.detectChanges();
  }
}
