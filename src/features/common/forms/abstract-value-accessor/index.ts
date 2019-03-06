import { EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DebugLog } from '../log';

export class AbstractValueAccessor implements ControlValueAccessor {
  @Output() readonly valueChange: EventEmitter<string | Date>;
  @Output() readonly touch: EventEmitter<boolean>;

  onChange: (_: any) => void;
  onTouched: () => void;

  _value: any;

  constructor() {
    this._value = '';
    this.valueChange = new EventEmitter<string | Date>();
    this.touch = new EventEmitter<boolean>();

    this.onChange = _ => {
      // Empty
    };

    this.onTouched = () => {
      // Empty
    };
  }
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.valueChange.emit(v);
      this.touch.emit(true);
      this.onChange(v);
      this.onTouched();
    }
  }

  @DebugLog doChange(data: string | Date): void {
    this.valueChange.emit(data);
    if (this.onChange) {
      this.onChange(data);
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
