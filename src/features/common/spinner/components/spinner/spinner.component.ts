import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: ''
})
export class SpinnerComponent {
  @Input() fullSize: boolean;
  showSpinner: boolean;
  constructor() {
    this.showSpinner = false;
  }

  @Input('garlictechSpinner')
  set garlictechSpinner(val: boolean) {
    this.showSpinner = val;
  }
}
