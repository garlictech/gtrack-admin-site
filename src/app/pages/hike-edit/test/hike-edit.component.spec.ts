import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore } from '../../../store/';
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
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
});
