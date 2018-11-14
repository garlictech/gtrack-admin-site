/* tslint:disable:no-unused-variable */
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Pipe, PipeTransform } from '@angular/core';

import { HikeDayComponent } from '../';
import { reducer } from 'app/store';
import { FormModule } from 'subrepos/gtrack-common-web/forms';
import { CONFIG as LANGUAGE_CONFIG } from 'subrepos/localize-ngx';

fdescribe('HikeDayComponent', () => {
  let component: HikeDayComponent;
  let fixture: ComponentFixture<HikeDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducer),
        EffectsModule.forRoot([]),
        FormModule
      ],
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
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
