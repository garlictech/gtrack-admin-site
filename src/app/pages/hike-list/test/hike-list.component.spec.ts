import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

// import { GtActions } from 'app/store/';
import { HikeDataService } from 'app/shared/services';
import { HikeDataServiceStub } from 'app/test/helpers/services';
import { MockStore } from 'app/test/helpers/store/';

import { HikeListComponent } from '../hike-list.component';

let comp: HikeListComponent;
let fixture: ComponentFixture<HikeListComponent>;
let store: any;

/*
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
        {
          provide: Store,
          useValue: new MockStore({})
        },
        {
          provide: HikeDataService,
          useClass: HikeDataServiceStub
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HikeListComponent);
    comp = fixture.debugElement.componentInstance;
    store = fixture.debugElement.injector.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

  it('should call delete', async(() => {
    const deleteAction = new GtActions.DeleteHikeAction('fakeid');

    comp.deleteHike('fakeid');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(deleteAction);
  }));
});
*/
