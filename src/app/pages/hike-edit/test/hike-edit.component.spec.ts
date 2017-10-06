import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, GtActions } from '../../../store/';
import { HikeEditComponent } from '../hike-edit.component';
import { ObjectToArrayPipe } from '../../../shared/pipes/';
import { HikeDataService } from '../../../shared/services';
import { ActivatedRouteStub } from '../../../shared/test-helpers';

declare const $: any;

let comp: HikeEditComponent;
let fixture: ComponentFixture<HikeEditComponent>;
let _store: any;
let mockParams;
let mockActivatedRoute;
let hikeDataService: HikeDataService;

describe('HikeEditComponent', () => {
  beforeEach(async(() => {
    // Mocking the jQuery material plugin
    $.material = {
      options: {},
      init: function(options) {/**/}
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
        HikeDataService,
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
    _store = fixture.debugElement.injector.get(Store);
    hikeDataService = TestBed.get(HikeDataService);


  }));

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

  describe('Edit hike', () => {
    beforeEach(async(() => {
      mockActivatedRoute.testParams = {id: '3'};
    }));

    it('should hikeData read hike id', async(() => {
      spyOn(hikeDataService, 'getHike').and.callThrough();

      fixture.detectChanges();
      expect(hikeDataService.getHike).toHaveBeenCalledWith('3');
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
    spyOn(_store, 'dispatch').and.callThrough();

    const saveAction = new GtActions.SaveHikeAction(comp.hikeData);

    comp.save();
    fixture.detectChanges();

    expect(_store.dispatch).toHaveBeenCalledWith(saveAction);
  }));
});
