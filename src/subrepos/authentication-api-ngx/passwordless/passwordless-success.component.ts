import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import * as Actions from '../store/actions';

interface SuccessParams {
  token: string;
  uid: string;
  roles: string;
}

@Component({
  selector: 'garlictech-aaa-passwordless-success',
  template: ''
})
export class PasswordlessSuccessComponent implements OnInit {
  constructor(private readonly store: Store<any>, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(filter(params => params && params.roles)).subscribe((params: SuccessParams) => {
      this.store.dispatch(new Actions.MagicLinkLogin(params.token, params.uid, params.roles.split(',')));
    });
  }
}
