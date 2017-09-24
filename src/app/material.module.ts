import { NgModule } from '@angular/core';
import {
    MATERIAL_COMPATIBILITY_MODE,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';

const MAT_MODULES: Array<any> = [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
];

@NgModule({
    imports: MAT_MODULES,
    exports: MAT_MODULES,
    providers: [{
        provide: MATERIAL_COMPATIBILITY_MODE, useValue: true
    }]
})

export class GtMaterialModule {}
