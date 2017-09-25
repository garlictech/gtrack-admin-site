import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MockStore } from '../../../store/';
import { GtMaterialModule } from '../../../material.module';
import { HikeListComponent } from '../hike-list.component';
import { HikeDataService, HikeDataSource } from '../../../shared/services';

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
                RouterTestingModule,
                GtMaterialModule
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
    });

    it('should create the component', async(() => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    }));
});
