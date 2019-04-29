import { filter, take } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Selectors as DeepstreamSelectors } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { FormModule } from '@bit/garlictech.angular-features.web.forms-primeng';
import { LanguageModule } from '@bit/garlictech.angular-features.web.language';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { select, Store, StoreModule } from '@ngrx/store';

import { DeletionButtonComponent } from './components/profile-deletion';
import { ProfilePhotoComponent } from './components/profile-photo';
import { SettingsFormComponent } from './components/settings-form';
import { UserBasicProfileFormComponent } from './components/user-basic-profile-form';
import { UserProfileFormComponent } from './components/user-profile-form';
import { UserSettingsFormComponent } from './components/user-settings-form/user-settings-form.component';
import { EProfileGroup } from './interfaces';
import { DebugLog } from './log';
import { SettingsService } from './services';
import { Actions, Effects, featureName, getReducers, SETTINGS_REDUCER_TOKEN } from './store';
import * as actions from './store/actions';
import { getHikeStartDate, profileGroupSelector, Selectors } from './store/selectors';

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
  constructor(private readonly _dsSelectors: DeepstreamSelectors, private readonly _store: Store<any>) {
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
