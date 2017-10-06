import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, GtActions } from '../../../store/';
import { HikeEditComponent } from '../hike-edit.component';
import { ObjectToArrayPipe } from '../../../shared/pipes/';
import { HikeDataService } from '../../../shared/services';

let comp: HikeEditComponent;
let fixture: ComponentFixture<HikeEditComponent>;
let _store: any;

describe('HikeEditComponent', () => {
  beforeEach(() => {
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
        // TODO: mock HikeDataService
        HikeDataService,
        {
          provide: Store,
          useValue: new MockStore({})
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HikeEditComponent);
    comp = fixture.debugElement.componentInstance;
    _store = fixture.debugElement.injector.get(Store);

    spyOn(_store, 'dispatch').and.callThrough();
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  it('should hikeData is an empty object initially', async(() => {
    fixture.detectChanges();
    expect(comp.hikeData).toEqual({
      title: {},
      description: {}
    });
  }));

  it('should existingLangKeys is an empty set initially', async(() => {
    fixture.detectChanges();
    expect(comp.existingLangKeys).toEqual(new Set([]));
  }));

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
    const saveAction = new GtActions.SaveHikeAction(comp.hikeData);

    comp.save();
    fixture.detectChanges();

    expect(_store.dispatch).toHaveBeenCalledWith(saveAction);
  }));
});
