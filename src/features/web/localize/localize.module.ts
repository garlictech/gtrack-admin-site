import { NgxMdModule } from 'ngx-md';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { DescriptionComponent } from './description';
import { HtmlDescriptionComponent } from './description/html-description/html-description.component';
import { MarkdownDescriptionComponent } from './description/markdown-description/markdown-description.component';

const COMPONENTS = [DescriptionComponent, HtmlDescriptionComponent, MarkdownDescriptionComponent];

@NgModule({
  imports: [CommonModule, NgxMdModule, MultiLanguageTextModule],
  exports: [...COMPONENTS, MultiLanguageTextModule],
  declarations: [...COMPONENTS],
  providers: []
})
export class LocalizeModule {}
