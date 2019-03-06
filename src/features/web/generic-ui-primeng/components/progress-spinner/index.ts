import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as fromUiSelectors from '@bit/garlictech.angular-features.common.generic-ui/store/selectors';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'garlictech-progress-spinner',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressSpinnerComponent implements OnInit {
  showSpinner$: Observable<boolean>;
  spinnerText$: Observable<string>;
  faSpinner: IconDefinition;

  constructor(protected _store: Store<any>) {
    this.faSpinner = faSpinner;
  }

  ngOnInit(): void {
    this.showSpinner$ = this._store.pipe(select(fromUiSelectors.selectProgressSpinnerOn));
    this.spinnerText$ = this._store.pipe(select(fromUiSelectors.selectProgressSpinnerText));
  }
}
