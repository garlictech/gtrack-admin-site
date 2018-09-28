import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';

import { LocalizeModule } from 'subrepos/localize-ngx';

import { LanguageSelectorComponent } from './language-selector';

@NgModule({
  imports: [CommonModule, FormsModule, DropdownModule, LocalizeModule.forRoot()],
  declarations: [LanguageSelectorComponent],
  exports: [LocalizeModule, LanguageSelectorComponent, TranslateModule]
})
export class LanguageModule {}

export { Actions, Reducer, ILocalizationState } from 'subrepos/localize-ngx';
