import { NgModule } from '@angular/core';
import {
    MdSidenavModule,
    MdToolbarModule,
    MdButtonModule
} from '@angular/material';

@NgModule({
    imports: [
        MdSidenavModule,
        MdToolbarModule,
        MdButtonModule
    ],
    exports: [
        MdSidenavModule,
        MdToolbarModule,
        MdButtonModule
    ],
})
export class GtMaterialModule { }
