import { Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DebugLog } from '../log';

export class AbstractValueAccessor implements ControlValueAccessor {
  @Input() change;
  onChange: (value: string | Date) => void;
  onTouched;
  _value: any;

  constructor() {
    this._value = '';

    this.onChange = _ => {
      // EMPTY
    };

    this.onTouched = () => {
      // EMPTY
    };
  }
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
      this.onTouched();
    }
  }

  @DebugLog doChange(): void {
    if (this.change) {
      this.change();
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
