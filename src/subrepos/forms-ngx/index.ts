import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CalendarModule,
  DropdownModule,
  MultiSelectModule,
  RadioButtonModule,
  InputSwitchModule,
  SliderModule
} from 'primeng/primeng';
import { FileDropModule } from 'angular2-file-drop';

import { LanguageModule } from 'app/language';
=======

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
>>>>>>> refs/subrepo/src/subrepos/forms-ngx/fetch

import { DatePickerComponent } from './date-picker';
import { MultiSelectComponent } from './multi-select';
import { RadioSelectComponent } from './radio-select';
import { DropdownSelectComponent } from './dropdown-select';
import { DynamicFormComponent } from './dynamic-form-component';
import { DynamicFormFieldComponent } from './dynamic-form-field-component';
import { DynamicFormGroupComponent } from './dynamic-form-group-component';
import { DynamicFormSectionComponent } from './dynamic-form-section-component';
import { SwitchComponent } from './switch';
<<<<<<< HEAD
import { SliderComponent } from './slider';
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
    SliderModule,
    LanguageModule,
    FileDropModule
  ],
=======
import { FieldControlService } from './field-control-service';
import { EmojiInputComponent } from './emoji-input';
import { FileUploadComponent } from './file-upload';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
>>>>>>> refs/subrepo/src/subrepos/forms-ngx/fetch
  declarations: [
    DatePickerComponent,
    MultiSelectComponent,
    RadioSelectComponent,
    DynamicFormComponent,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
    DynamicFormSectionComponent,
    DropdownSelectComponent,
<<<<<<< HEAD
    FileUploadComponent,
    SwitchComponent,
    BusyIndicatorComponent,
    SliderComponent
=======
    SwitchComponent,
    EmojiInputComponent,
    FileUploadComponent
>>>>>>> refs/subrepo/src/subrepos/forms-ngx/fetch
  ],
  providers: [FieldControlService]
})
export class FormModule {}

export * from './field';

export {
  DatePickerComponent,
  MultiSelectComponent,
  RadioSelectComponent,
  DropdownSelectComponent,
  DynamicFormComponent,
  DynamicFormFieldComponent,
  DynamicFormGroupComponent,
  DynamicFormSectionComponent,
  SwitchComponent,
  EmojiInputComponent,
  FileUploadComponent
};
