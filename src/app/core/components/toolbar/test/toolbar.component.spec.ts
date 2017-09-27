import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GtMaterialModule } from '../../../../material.module';
import { ToolbarComponent } from '../toolbar.component';

let comp: ToolbarComponent;
let fixture: ComponentFixture<ToolbarComponent>;
let _store: any;

describe('ToolbarComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ToolbarComponent
            ],
            imports: [
                GtMaterialModule,
                NoopAnimationsModule,
                RouterTestingModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ToolbarComponent);
        comp = fixture.debugElement.componentInstance;
    });

    it('should create the component', async(() => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    }));
});
