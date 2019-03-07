import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { select, Store, StoreModule } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { DebugLog } from 'app/log';
import { Selectors as DeepstreamSelectors } from 'subrepos/gtrack-common-ngx';
import { FormModule } from 'subrepos/gtrack-common-web/forms';
import { LanguageModule } from 'subrepos/gtrack-common-web/language';

import { State } from 'app/store';
import { EProfileGroup } from './interfaces';
import { DeletionButtonComponent } from './profile-deletion';
import { ProfilePhotoComponent } from './profile-photo';
import { SettingsService } from './services';
import { SettingsFormComponent } from './settings-form';
import { Actions, Effects, featureName, getReducers, SETTINGS_REDUCER_TOKEN } from './store';
import { getHikeStartDate, profileGroupSelector, Selectors } from './store/selectors';
import { UserBasicProfileFormComponent } from './user-basic-profile-form';
import { UserProfileFormComponent } from './user-profile-form';
import { UserSettingsFormComponent } from './user-settings-form';

import * as actions from './store/actions';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    FormModule,
    LanguageModule,
    FontAwesomeModule,
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, SETTINGS_REDUCER_TOKEN)
  ],
  declarations: [
    UserBasicProfileFormComponent,
    UserProfileFormComponent,
    UserSettingsFormComponent,
    DeletionButtonComponent,
    ProfilePhotoComponent,
    SettingsFormComponent
  ],
  exports: [
    UserProfileFormComponent,
    ProfilePhotoComponent,
    UserSettingsFormComponent,
    UserBasicProfileFormComponent,
    DeletionButtonComponent
  ],
  providers: [
    Selectors,
    SettingsService,
    {
      provide: SETTINGS_REDUCER_TOKEN,
      useFactory: getReducers
    }
  ]
})
export class SettingsModule {
  constructor(private readonly _dsSelectors: DeepstreamSelectors, private readonly _store: Store<State>) {
    this._init();
  }

  @DebugLog _init(): void {
    this._store
      .pipe(
        select(this._dsSelectors.loggedIn),
        filter(state => state)
      )
      .subscribe(() => this._store.dispatch(new Actions.SettingsFetchStart()));

    this._store.pipe(select(profileGroupSelector(EProfileGroup.settings))).subscribe(settings => {
      if (settings) {
        if (settings.startTime) {
          this._store
            .pipe(select(getHikeStartDate))
            .pipe(take(1))
            .subscribe(startDate => {
              const dateFromSettings = new Date(settings.startTime);
              const date = new Date(startDate.getTime());
              date.setHours(dateFromSettings.getHours());
              date.setMinutes(dateFromSettings.getMinutes());

              this._store.dispatch(new actions.ChangeHikeProgramStartDate(date));
            });
        }

        if (settings.speed) {
          this._store.dispatch(new actions.ChangeHikeProgramSpeed(settings.speed));
        }
      }
    });
  }
}
