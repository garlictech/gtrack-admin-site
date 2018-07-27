import { Component } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'gt-table-spinner',
  template: '<div class="text-center p-3"><fa-icon [icon]="faSpinner" [spin]="true" class="fa-li fa fa-spinner fa-spin poi-spinner"></fa-icon></div>',
  styles: ['div { position: relative; } .fa-li  { position: static; }']
})
export class TableSpinnerComponent {
  public faSpinner = faSpinner;
}
