import { Directive, Input, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'app/store';

@Directive({
  selector: '[connectForm]'
})
export class ConnectFormDirective implements OnInit {
  @Input() path: string;

  constructor(
    private _formGroupDirective: FormGroupDirective,
    private _store: Store<State>
  ) {}

  ngOnInit() {
    // Update the form value based on the state
    this._store.select(state => state.hikeEditGeneralInfo[this.path])
      .take(1)
      .subscribe(formValue => {
        this._formGroupDirective.form.patchValue(formValue);
      });
  }
}
