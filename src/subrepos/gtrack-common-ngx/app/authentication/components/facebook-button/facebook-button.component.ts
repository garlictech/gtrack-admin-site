import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  Actions as AuthActions
} from 'subrepos/authentication-api-ngx';

@Component({
  selector: 'gtcn-facebook-button',
  templateUrl: './facebook-button.component.html',
  styleUrls: ['./facebook-button.component.scss']
})
export class FacebookButtonComponent {
  constructor(
    private store: Store<any>
  ) { }

  public buttonClicked(e: Event): void {
    e.preventDefault();

    this.store.dispatch(new AuthActions.FacebookLogin());
  }
}
