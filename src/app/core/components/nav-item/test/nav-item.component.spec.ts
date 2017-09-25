import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GtMaterialModule } from '../../../../material.module';
import { NavItemComponent } from '../nav-item.component';

let comp: NavItemComponent;
let fixture: ComponentFixture<NavItemComponent>;
let _store: any;

describe('NavItemComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavItemComponent
            ],
            imports: [
                RouterTestingModule,
                GtMaterialModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NavItemComponent);
        comp = fixture.debugElement.componentInstance;
    });

    it('should create the component', async(() => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    }));
});
