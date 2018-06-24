import { ControlValueAccessor } from '@angular/forms';
import { Input } from '@angular/core';
import { DebugLog } from '../log';

export abstract class AbstractValueAccessor implements ControlValueAccessor {
  @Input() change;

  @DebugLog
  doChange() {
    console.log(this.change);
    if (this.change) {
      this.change();
    }
  }

  _value: any = '';

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  writeValue(value: any) {
    this._value = value;
    this.onChange(value);
  }

  onChange = _ => {
    /* EMPTY */
  };
  onTouched = () => {
    /* EMPTY */
  };
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
