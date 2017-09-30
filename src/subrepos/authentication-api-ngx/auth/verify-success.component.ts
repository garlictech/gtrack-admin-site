import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: SuccessParams) => {
      this.store.dispatch(new Actions.Verify(params));
    });
  }
}
