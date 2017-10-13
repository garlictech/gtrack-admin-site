import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private store: Store<any>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: SuccessParams) => {
      this.store.dispatch(
        new Actions.MagicLinkLogin({
          token: params.token,
          uid: params.uid,
          roles: params.roles.split(',')
        })
      );
    });
  }
}
