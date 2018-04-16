/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LanguageSelectorComponent } from '../';
import { LanguageService } from '../../language-service';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let language = [{ id: 'hu_HU', name: 'Magyar' }, { id: 'en_US', name: 'English' }];

  class MockLanguageService {
    getSupportedLanguages() {
      return 'hu_HU';
    }
  }

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [LanguageSelectorComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n', '.json'),
              deps: [HttpClient]
            }
          })
        ],
        providers: [{ provide: LanguageService, useClass: MockLanguageService }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
