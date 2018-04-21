import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { hikeListActions } from '../../../store/';
import { MockStore } from '../../../test/helpers/store/';
import { HikeListComponent } from '../hike-list.component';

let comp: HikeListComponent;
let fixture: ComponentFixture<HikeListComponent>;
let store: any;

/*
fdescribe('HikeListComponent', () => {
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
    const deleteAction = new hikeListActions.DeleteHike({hikeId: 'fakeid'});

    comp.deleteHike('fakeid');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(deleteAction);
  }));
});
*/
