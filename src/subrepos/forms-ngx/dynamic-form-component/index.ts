import { Store } from '@ngrx/store';
import { Component, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import { log } from '../log';

import { Field, IFormDescriptor } from '../field';
import { FieldControlService, IFormInstance } from '../field-control-service';

@Component({
  selector: 'app-form',
  template: ''
})
export class DynamicFormComponent implements AfterViewInit, OnDestroy {
  @Input() formDescriptor: IFormDescriptor;
  @Input() formDataPath$: Observable<string>;

  public formInstance: IFormInstance;
  private _componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private _fcs: FieldControlService, private _store: Store<any>, private _cdr: ChangeDetectorRef) {
    /* EMPTY */
  }

  ngAfterViewInit() {
    this.formInstance = this._fcs.toFormGroup(this.formDescriptor.fields, {});
    this._cdr.detectChanges();

    if (this.formDataPath$) {
      this.formDataPath$
        .filter(formDataPath => !!formDataPath)
        .switchMap(formDataPath => this._store.select(state => _.get(state, formDataPath)))
        .takeUntil(this._componentDestroyed$)
        .filter(formData => !!formData)
        .map(formData => {
          const fieldKeys = Object.keys(this.formDescriptor.fields);
          return _.pick(formData, fieldKeys);
        })
        .subscribe(formData => {
          this.formInstance = this._fcs.toFormGroup(this.formDescriptor.fields, formData);
          this.formInstance.form.patchValue(formData);

          this._cdr.detectChanges();
        });
    }
  }

  onSubmit() {
    if (this.formInstance.form.valid) {
      log.d('Submitting form...');

      this.formDescriptor.submit.submitFv(this.formInstance.form);

      if (!!this.formDescriptor.submit.resetOnSubmit) {
        this._resetForm();
      }

      return;
    }

    log.d('Form is invalid, not submitting.');

    this._validateForm(this.formInstance.form);
  }

  getOnSubmit() {
    return function() {
      this.onSubmit();
    }.bind(this);
  }

  ngOnDestroy() {
    this._componentDestroyed$.next(true);
    this._componentDestroyed$.complete();
  }

  private _resetForm() {
    if (this.formDescriptor.submit.resetFv instanceof Function) {
      this.formInstance = this.formDescriptor.submit.resetFv(this.formDescriptor);

      this._cdr.detectChanges();

      return;
    }

    this.formInstance = this._fcs.toFormGroup(this.formDescriptor.fields, {});

    this._cdr.detectChanges();
  }

  private _validateForm(form) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);

      if (control instanceof FormArray) {
        control.controls.forEach(arrayCtrl => {
          this._validateForm(arrayCtrl);
        });
      } else if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}
