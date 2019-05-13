import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as Actions from '../../store/actions';

interface SuccessParams {
  token: string;
  uid: string;
}

@Component({
  selector: 'app-verify-success',
  template: ''
})
export class VerifySuccessComponent implements OnInit {
  constructor(private readonly store: Store<any>, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: SuccessParams) => {
      this.store.dispatch(new Actions.Verify(params.token, params.uid));
    });
  }
}
