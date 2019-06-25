import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '@bit/garlictech.angular-features.common.utils';
import { FormModule } from '@bit/garlictech.angular-features.web.forms-primeng';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { SliderModule } from 'primeng/slider';
import { SearchFiltersComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    TranslateModule,
    SliderModule,
    UtilsModule,
    ReactiveFormsModule,
    FormModule
  ],
  exports: [SearchFiltersComponent],
  declarations: [SearchFiltersComponent]
})
export class SearchFiltersComponentsModule {}
