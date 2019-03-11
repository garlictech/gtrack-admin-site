import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject } from 'rxjs';

import { EAuthRoles } from '@features/common/gtrack-interfaces';

@Component({
  selector: 'gtrack-profile-photo',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePhotoComponent implements OnInit, OnDestroy {
  @Input() enableIcon: boolean;
  @Input() role$?: Observable<EAuthRoles | null>;
  @Input() userId$?: Observable<string | null>;

  icon: IconDefinition;

  profile$: Observable<any>;
  userIcon?: string;

  private readonly _componentDestroyed$: Subject<boolean>;

  constructor() {
    this.enableIcon = false;

    this.icon = faUser;

    this._componentDestroyed$ = new Subject();
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this._componentDestroyed$.next(true);
    this._componentDestroyed$.complete();
  }
}
