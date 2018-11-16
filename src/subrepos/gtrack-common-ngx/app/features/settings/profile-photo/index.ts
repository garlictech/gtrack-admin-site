import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { EAuthRoles } from 'subrepos/provider-client';

@Component({
  selector: 'gtrack-profile-photo',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePhotoComponent implements OnInit, OnDestroy {
  @Input()
  enableIcon = false;
  @Input()
  role$: Observable<EAuthRoles | null> | undefined;
  @Input()
  userId$: Observable<string | null> | undefined;

  public icon = faUser;

  public profile$: Observable<any>;
  public userIcon: string | null = null;

  private _componentDestroyed$: Subject<boolean> = new Subject();

  constructor(/* private _selectors: Selectors */) {
    /* EMPTY */
  }

  ngOnInit() {
    // if (!this.role$) {
    //   this.role$ = Observable.of(null);
    // }
    // if (!this.userId$) {
    //   this.userId$ = Observable.of(null);
    // }
    // let profile$ = Observable.combineLatest(this.role$, this.userId$).switchMap(result => {
    //   let role = result[0];
    //   let userId = result[1];
    //   return role && userId ? this._selectors.getPublicProfileOf(userId, role) : this._selectors.getMyPublicProfile;
    // });
    // this.profile$ = profile$.filter(profile => !!profile);
  }

  ngOnDestroy() {
    this._componentDestroyed$.next(true);
    this._componentDestroyed$.complete();
  }
}
