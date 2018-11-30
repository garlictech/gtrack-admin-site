import _pick from 'lodash-es/pick';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { DebugLog, log } from 'app/log';
import { FieldControlService, IFormInstance } from '../field-control-service';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { FormArray } from '@angular/forms';
import { IFormDescriptor } from '../field';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form',
  moduleId: module.id,
  template: ''
})
export class DynamicFormComponent implements AfterViewInit, OnDestroy {
  @Input()
  formDescriptor: IFormDescriptor;

  public formInstance: IFormInstance;

  private _componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private _fcs: FieldControlService, private _store: Store<any>, private _cdr: ChangeDetectorRef) {
    /* EMPTY */
  }

  @DebugLog
  ngAfterViewInit() {
    this.formInstance = this._fcs.toFormGroup(this.formDescriptor.fields, {});
    this._cdr.detectChanges();

    if (this.formDescriptor.formDataSelector) {
      this._store
        .pipe(
          select(this.formDescriptor.formDataSelector),
          takeUntil(this._componentDestroyed$),
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

  onSubmit(e?: Event) {
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
      this._validateForm(this.formInstance.form);
    }
  }

  stringify(obj, replacer, spaces, cycleReplacer) {
    return JSON.stringify(obj, this.serializer(replacer, cycleReplacer), spaces);
  }

  serializer(replacer, cycleReplacer) {
    const stack = [],
      keys = [];

    if (cycleReplacer == null) {
      cycleReplacer = function(key, value) {
        if (stack[0] === value) {
          return '[Circular ~]';
        }
        return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
      };
    }

    return function(key, value) {
      if (stack.length > 0) {
        const thisPos = stack.indexOf(this);
        !thisPos ? stack.splice(thisPos + 1) : stack.push(this);
        !thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
        if (!stack.indexOf(value)) {
          value = cycleReplacer.call(this, key, value);
        }
      } else {
        stack.push(value);
      }

      return replacer == null ? value : replacer.call(this, key, value);
    };
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
    } else {
      this.formInstance = this._fcs.toFormGroup(this.formDescriptor.fields, {});
    }
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
