
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LanguageSelectorComponent } from '../';
import { LanguageService } from '../../language-service';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  const language = [{ id: 'en_US', name: 'English' }];

  class MockLanguageService {
    getSupportedLanguages() {
      return 'en_US';
    }
  }

  beforeEach(async(() => {
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
