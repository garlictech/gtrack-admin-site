import { Component } from '@angular/core';
import { SpinnerComponent as NativeSpinnerComponent } from '@bit/garlictech.angular-features.common.spinner/components/spinner';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[garlictechSpinner]',
  exportAs: 'garlictechSpinner',
  templateUrl: 'ui.html',
  styleUrls: ['style.scss']
})
export class SpinnerComponent extends NativeSpinnerComponent {}
