import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { Store } from '@ngrx/store';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';

import { LanguageSelectorComponent } from '../language-selector';
import { LanguageService } from '../language-service';
import { DebugLog, log } from '../log';
import { Actions } from '../store';

export const _init = () => () => {
  log.data('[LocalizeModule:app init] initializing localization module...');
};

// tslint:disable-next-line:only-arrow-functions

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [LanguageSelectorComponent],
  providers: [LanguageService],
  exports: [TranslateModule, LanguageSelectorComponent]
})
export class LocalizeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocalizeModule,
      providers: [{ provide: APP_INITIALIZER, useFactory: _init, deps: [LanguageService], multi: true }]
    };
  }

  constructor(private readonly _translateService: TranslateService, private readonly _store: Store<any>) {
    this._init();
  }

  @DebugLog _init(): void {
    this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this._store.dispatch(new Actions.LanguageChanged(event.lang));
    });
  }
}

export * from './config';
