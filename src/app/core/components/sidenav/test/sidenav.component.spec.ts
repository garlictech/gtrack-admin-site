import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GtMaterialModule } from '../../../../material.module';
import { SidenavComponent } from '../sidenav.component';

let comp: SidenavComponent;
let fixture: ComponentFixture<SidenavComponent>;
let _store: any;

describe('SidenavComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                SidenavComponent
            ],
            imports: [
                RouterTestingModule,
                GtMaterialModule,
                NoopAnimationsModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        comp = fixture.debugElement.componentInstance;
    });

    it('should create the component', async(() => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    }));
});
