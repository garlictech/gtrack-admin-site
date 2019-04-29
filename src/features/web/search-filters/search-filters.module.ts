import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@bit/garlictech.angular-features.web.forms-primeng';
import { SearchFiltersComponent } from './components';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormModule],
  exports: [SearchFiltersComponent],
  declarations: [SearchFiltersComponent]
})
export class SearchComponentsModule {}
