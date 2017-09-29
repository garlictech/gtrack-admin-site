import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FooterComponent } from '../footer.component';
import 'intl/index';
import 'intl/locale-data/jsonp/en.js';

let comp: FooterComponent;
let fixture: ComponentFixture<FooterComponent>;
let _store: any;

describe('FooterComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent
            ],
            imports: [
                RouterTestingModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FooterComponent);
        comp = fixture.debugElement.componentInstance;
    });

    it('should create the component', async(() => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    }));
});
