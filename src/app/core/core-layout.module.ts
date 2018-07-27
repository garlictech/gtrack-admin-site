import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { LayoutComponent } from './components/layout';
import { MenuComponent } from './components/menu';
import { TopBarComponent } from './components/topbar';
import { FooterComponent } from './components/footer';
import { SubMenuComponent } from './components/sub-menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
