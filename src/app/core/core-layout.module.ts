import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout';
import { MenuComponent } from './components/menu';
import { TopBarComponent } from './components/topbar';
import { FooterComponent } from './components/footer';
import { SubMenuComponent } from './components/sub-menu';
import { PageNotFoundComponent } from './components/page-not-found';
import { ScrollPanelModule, CardModule } from 'primeng/primeng';

const COMPONENTS = [
  PageNotFoundComponent,

  //
  // PrimeNG wireframe:
  // https://github.com/primefaces/primeng-blueprint
  //

  LayoutComponent,
  MenuComponent,
  SubMenuComponent,
  TopBarComponent,
  FooterComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // PrimeNG
    ScrollPanelModule,
    CardModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS]
})
export class CoreLayoutModule {}
