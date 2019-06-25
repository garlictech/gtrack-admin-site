import { Component } from '@angular/core';
import { SpinnerComponent as NativeSpinnerComponent } from '@bit/garlictech.angular-features.common.spinner/components/spinner/spinner.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[garlictechSpinner]',
  exportAs: 'garlictechSpinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss']
})
export class SpinnerComponent extends NativeSpinnerComponent {}
