import { DropdownModule } from 'primeng/dropdown';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalizeModule } from '@bit/garlictech.angular-features.common.localization';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';

@NgModule({
  imports: [CommonModule, FormsModule, DropdownModule, LocalizeModule.forRoot()],
  declarations: [LanguageSelectorComponent],
  exports: [LocalizeModule, LanguageSelectorComponent, TranslateModule]
})
export class LanguageModule {}
