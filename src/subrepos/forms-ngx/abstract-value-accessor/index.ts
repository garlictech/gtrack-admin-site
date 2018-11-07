import { ControlValueAccessor } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { DebugLog } from '../log';

export abstract class AbstractValueAccessor implements ControlValueAccessor {
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  @Output()
  change = new EventEmitter<any>();

  _value: any = '';

  @DebugLog
  doChange(data: any) {
    this.change.emit(data);
  }

  writeValue(value: any) {
    this._value = value;
    this.onChange(value);
  }

  onChange = _ => {
    /* EMPTY */
  }
  onTouched = () => {
    /* EMPTY */
  }
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
