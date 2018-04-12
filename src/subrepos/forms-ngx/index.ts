import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CalendarModule,
  DropdownModule,
  MultiSelectModule,
  RadioButtonModule,
  InputSwitchModule
} from 'primeng/primeng';
import { FileDropModule } from 'angular2-file-drop';

import { LanguageModule } from 'app/language';

import { DatePickerComponent } from './date-picker';
import { MultiSelectComponent } from './multi-select';
import { EmojiInputComponent } from './emoji-input';
import { RadioSelectComponent } from './radio-select';
import { DropdownSelectComponent } from './dropdown-select';
import { DynamicFormComponent } from './dynamic-form-component';
import { DynamicFormFieldComponent } from './dynamic-form-field-component';
import { DynamicFormGroupComponent } from './dynamic-form-group-component';
import { DynamicFormSectionComponent } from './dynamic-form-section-component';
import { FileUploadComponent } from './file-upload';
import { SwitchComponent } from './switch';
import { BusyIndicatorComponent } from './busy-indicator';

import { XhrFileUpload } from './xhr-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    RadioButtonModule,
    InputSwitchModule,
    LanguageModule,
    FileDropModule
  ],
  declarations: [
    DatePickerComponent,
    MultiSelectComponent,
    EmojiInputComponent,
    RadioSelectComponent,
    DynamicFormComponent,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
    DynamicFormSectionComponent,
    DropdownSelectComponent,
    FileUploadComponent,
    SwitchComponent,
    BusyIndicatorComponent
  ],
  providers: [XhrFileUpload],
  exports: [DynamicFormComponent, EmojiInputComponent]
})
export class FormModule {}

export * from './field';
