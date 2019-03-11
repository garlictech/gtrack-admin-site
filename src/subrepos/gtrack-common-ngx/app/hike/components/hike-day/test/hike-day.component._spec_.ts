/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CONFIG as LANGUAGE_CONFIG } from '@features/common/localization';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducer } from 'app/store';
import { FormModule } from 'subrepos/gtrack-common-web/forms';
import { HikeDayComponent } from '../';

/*
// TODO fix NullInjectorError: No provider for LanguageService InjectionToken Config!
describe('HikeDayComponent', () => {
  let component: HikeDayComponent;
  let fixture: ComponentFixture<HikeDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducer), EffectsModule.forRoot([]), FormModule],
      providers: [
        {
          provide: LANGUAGE_CONFIG,
          useValue: {
            defaultLanguage: 'en_US',
            supportedLanguages: ['en_US', 'hu_HU']
          }
        }
      ],
      declarations: [HikeDayComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeDayComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {

    // fixture.detectChanges();
    // expect(component).toBeTruthy();
  });
});
*/
