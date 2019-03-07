import { Component } from '@angular/core';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table-spinner',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class TableSpinnerComponent {
  faSpinner: IconDefinition;

  constructor() {
    this.faSpinner = faSpinner;
  }
}
