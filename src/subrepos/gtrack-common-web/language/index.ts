import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';

import { LocalizeModule } from '@bit/garlictech.angular-features.common.localization';

import { LanguageSelectorComponent } from './language-selector';

@NgModule({
  imports: [CommonModule, FormsModule, DropdownModule, LocalizeModule.forRoot()],
  declarations: [LanguageSelectorComponent],
  exports: [LocalizeModule, LanguageSelectorComponent, TranslateModule]
})
export class LanguageModule {}

export { Actions, Reducer, LocalizationState } from '@bit/garlictech.angular-features.common.localization';
