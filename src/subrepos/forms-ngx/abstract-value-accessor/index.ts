import { ControlValueAccessor } from '@angular/forms';
import { Input } from '@angular/core';
import { DebugLog } from '../log';

export abstract class AbstractValueAccessor implements ControlValueAccessor {
<<<<<<< HEAD
=======

>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }
  @Input()
  change;

  _value: any = '';

  @DebugLog
  doChange() {
    if (this.change) {
      this.change();
    }
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
