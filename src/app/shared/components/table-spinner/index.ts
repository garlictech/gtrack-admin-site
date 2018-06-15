import { Component } from '@angular/core';

@Component({
  selector: 'gt-table-spinner',
  template: '<div class="text-center p-3"><i class="fa-li fa fa-spinner fa-spin poi-spinner"></i></div>',
  styles: ['div { position: relative; } .fa-li  { position: static; }']
})
export class TableSpinnerComponent {}
