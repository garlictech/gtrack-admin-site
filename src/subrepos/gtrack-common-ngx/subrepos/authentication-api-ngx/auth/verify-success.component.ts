import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import * as Actions from '../store/actions';

interface SuccessParams {
  token: string;
  uid: string;
}

@Component({
  selector: 'garlictech-aaa-verify-success',
  template: ''
})
export class VerifySuccessComponent implements OnInit {
  constructor(private store: Store<any>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: SuccessParams) => {
      this.store.dispatch(new Actions.Verify(params));
    });
  }
}
