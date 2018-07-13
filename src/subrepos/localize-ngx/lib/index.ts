import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateLoader, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ILocalizeConfig } from './config';
import { LanguageService } from '../language-service';
import { LanguageSelectorComponent } from '../language-selector';
import { DebugLog } from '../log';
import { Actions } from '../store';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [LanguageSelectorComponent],
  providers: [LanguageService],
  exports: [TranslateModule, LanguageSelectorComponent]
})
export class LocalizeModule {
  static forRoot(config: ILocalizeConfig): ModuleWithProviders {
    return {
      ngModule: LocalizeModule,
      providers: [
        {
          provide: 'LOCALIZE_CONFIG',
          useValue: config
        }
      ]
    };
  }

  constructor(private _translateService: TranslateService, private _store: Store<any>) {
    this._init();
  }

  @DebugLog
  private _init() {
    this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this._store.dispatch(new Actions.LanguageChanged(event.lang));
    });
  }
}

export * from './config';
