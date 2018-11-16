import _get from 'lodash-es/get';
import _keys from 'lodash-es/keys';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { EMPTY, Observable, Subject } from 'rxjs';
import { Field, IFormDescriptor } from '../field';
import { filter, map, pluck } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-field',
  template: ''
})
export class DynamicFormFieldComponent implements OnInit, OnDestroy {
  @Input()
  form: FormGroup;

  @Input()
  field: Field<any>;

  @Input()
  formDescriptor: IFormDescriptor;

  @Output()
  submit = new EventEmitter<any>();

  public remoteError$: Observable<string> = EMPTY;

  private _change$ = new Subject<any>();
  private _destroy$ = new Subject<boolean>();

  constructor(private _translate: TranslateService, private _store: Store<any>) {
    /* EMPTY */
  }

  ngOnInit() {
    this._change$
      .pipe(
        takeUntil(this._destroy$),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(() => this._handleChange());

    if (this.field.remoteErrorStateSelector) {
      this.remoteError$ = this._store.pipe(
        select(this.field.remoteErrorStateSelector),
        filter(err => this.field.remoteErrorStateFilter.indexOf(err) === -1),
        map(label => (label ? this._translate.instant(`form.errors.${label}`) : null))
      );
    } else if (this.formDescriptor.remoteErrorStateSelector) {
      this.remoteError$ = this._store.pipe(
        select(this.formDescriptor.remoteErrorStateSelector),
        filter(error => !!error),
        pluck(this.field.key),
        filter((err: string) => this.field.remoteErrorStateFilter.indexOf(err) === -1),
        map(label => (label ? this._translate.instant(`form.errors.${label}`) : null))
      );
    }

    if (this.field.formDataSelector) {
      this._store
        .pipe(
          select(this.field.formDataSelector),
          takeUntil(this._destroy$),
          filter(fieldData => !!fieldData)
        )
        .subscribe(fieldData => {
          const val: Object = {};
          val[this.field.key] = fieldData;
          this.form.patchValue(val);
        });
    }
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  onChange(data: any) {
    this._change$.next(data);
  }

  getOnChange() {
    return function() {
      if (this.field.submitOnChange) {
        this.formDescriptor.submit();
      }
    }.bind(this);
  }

  get labelParams() {
    if (this.field.labelParams) {
      return this.field.labelParams;
    }

    return {};
  }

  get sanitizedPlaceholder() {
    return _get(this.field, 'placeholder', '');
  }

  get containerClasses() {
    const list = ['form-group'];

    if (this.field.controlType === 'switch') {
      list.push('switch-group');
    }

    return list;
  }

  get showError() {
    const fieldObj = this._fieldObj();

    if (!!fieldObj) {
      return fieldObj.invalid && (fieldObj.dirty || fieldObj.touched);
    } else {
      return false;
    }
  }

  get showRemoteError() {
    const fieldObj = this._fieldObj();

    if (!!fieldObj) {
      return !(fieldObj.touched || fieldObj.dirty);
    } else {
      return false;
    }
  }

  get actualError() {
    const fieldObj = this._fieldObj();
    const errorKey = _keys(fieldObj.errors)[0];
    return errorKey ? this._translate.instant(`form.errors.${errorKey}`) : null;
  }

  protected _handleChange() {
    if (this.field.submitOnChange) {
      this.submit.emit();
    }
  }

  private _fieldObj(): any {
    return _get(this.form, `controls[${this.field.key}]`);
  }
}
