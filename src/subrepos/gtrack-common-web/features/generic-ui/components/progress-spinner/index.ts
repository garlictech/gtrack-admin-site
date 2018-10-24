import * as fromUiSelectors from '@common.features/generic-ui/store/selectors';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'garlictech-progress-spinner',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressSpinnerComponent implements OnInit {
  public showSpinner$: Observable<boolean>;
  public spinnerText$: Observable<string>;
  public faSpinner = faSpinner;

  constructor(protected _store: Store<any>) {
    /* EMPTY */
  }

  ngOnInit() {
    this.showSpinner$ = this._store.pipe(select(fromUiSelectors.selectProgressSpinnerOn));
    this.spinnerText$ = this._store.pipe(select(fromUiSelectors.selectProgressSpinnerText));
  }
}
