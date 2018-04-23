import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';

// import { GtActions } from 'app/store/';
import { MockStore } from '../../../test/helpers/store/';
import { ActivatedRouteStub } from '../../../test/helpers/services';

import { HikeEditComponent } from '../hike-edit.component';
import { ObjectToArrayPipe } from '../../../shared/pipes/';

declare const $: any;

let comp: HikeEditComponent;
let fixture: ComponentFixture<HikeEditComponent>;
let store: any;
let mockParams;
let mockActivatedRoute;

/*
describe('HikeEditComponent', () => {
  beforeEach(async(() => {
    // Mocking the jQuery material plugin
    $.material = {
      options: {},
      init: function(options) {/ ** /}
    };

    mockActivatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [
        HikeEditComponent,
        ObjectToArrayPipe
      ],
      imports: [
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: Store,
          useValue: new MockStore({})
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(HikeEditComponent);
    comp = fixture.debugElement.componentInstance;
    store = fixture.debugElement.injector.get(Store);

  }));

  afterEach(() => {
    delete $.material;
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  describe('New hike', () => {
    it('should hikeData is an empty object initially', async(() => {
      fixture.detectChanges();
      expect(comp.hikeData).toEqual({
        title: {},
        description: {},
        summary: {}
      });
    }));

    it('should existingLangKeys is an empty set initially', async(() => {
      fixture.detectChanges();
      expect(comp.existingLangKeys).toEqual(new Set([]));
    }));

    it('should existingLangKeys is an empty set initially', async(() => {
      fixture.detectChanges();
      expect(comp.existingLangKeys).toEqual(new Set([]));
    }));
  });

  it('should not add empty language key to translations', async(() => {
    comp.selLang = null;
    fixture.detectChanges();

    comp.addTranslation();
    fixture.detectChanges();

    expect(comp.existingLangKeys.size).toBe(0);
  }));

  it('should add selected language key to translations', async(() => {
    comp.selLang = 'en_US';
    fixture.detectChanges();

    comp.addTranslation();
    fixture.detectChanges();

    expect(comp.existingLangKeys.size).toBe(1);
    expect(Object.keys(comp.hikeData.title).length).toBe(1);
    expect(Object.keys(comp.hikeData.description).length).toBe(1);
    expect(comp.selLang).toBeNull();
  }));

  it('should call save', async(() => {
    spyOn(store, 'dispatch').and.callThrough();

    const saveAction = new GtActions.SaveHikeAction(comp.hikeData);

    comp.save();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(saveAction);
  }));
});
*/
