import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FooterComponent } from './components/footer';
import { LayoutComponent } from './components/layout';
import { MenuComponent } from './components/menu';
import { SubMenuComponent } from './components/sub-menu';
import { TopBarComponent } from './components/topbar';

const COMPONENTS = [LayoutComponent, MenuComponent, SubMenuComponent, TopBarComponent, FooterComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    // PrimeNG
    ScrollPanelModule,
    CardModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS]
})
export class CoreLayoutModule {}
