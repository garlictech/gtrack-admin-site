import { NgxMdModule } from 'ngx-md';
import { SharedModule } from 'subrepos/gtrack-common-ngx/app/shared';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MultiLanguageTextModule } from '@features/common/multi-language-text';

import { DescriptionComponent } from './description';
import { HtmlDescriptionComponent } from './description/html-description/html-description.component';
import { MarkdownDescriptionComponent } from './description/markdown-description/markdown-description.component';

const COMPONENTS = [DescriptionComponent, HtmlDescriptionComponent, MarkdownDescriptionComponent];

@NgModule({
  imports: [SharedModule, CommonModule, NgxMdModule, MultiLanguageTextModule],
  exports: [...COMPONENTS, MultiLanguageTextModule],
  declarations: [...COMPONENTS],
  providers: []
})
export class LocalizeModule {}
