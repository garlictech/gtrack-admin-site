import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MockStore, GtActions } from '../../../store/';
import { HikeListComponent } from '../hike-list.component';
import { HikeDataService } from '../../../shared/services';

let comp: HikeListComponent;
let fixture: ComponentFixture<HikeListComponent>;
let _store: any;

describe('HikeListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HikeListComponent
      ],
      imports: [
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

    fixture = TestBed.createComponent(HikeListComponent);
    comp = fixture.debugElement.componentInstance;
    _store = fixture.debugElement.injector.get(Store);

    spyOn(_store, 'dispatch').and.callThrough();
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  it('should call delete', async(() => {
    const deleteAction = new GtActions.DeleteHikeAction('fakeid');

    comp.deleteHike('fakeid');
    fixture.detectChanges();

    expect(_store.dispatch).toHaveBeenCalledWith(deleteAction);
  }));
});
