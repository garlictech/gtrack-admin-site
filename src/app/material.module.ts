import { NgModule } from '@angular/core';

import {
    MATERIAL_COMPATIBILITY_MODE,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatCardModule
} from '@angular/material';

@NgModule({
    imports: [
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatListModule,
        MatCardModule
    ],
    exports: [
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatListModule,
        MatCardModule
    ],
    providers: [
        {
            provide: MATERIAL_COMPATIBILITY_MODE, useValue: true
        }
    ]
})
export class GtMaterialModule { }
