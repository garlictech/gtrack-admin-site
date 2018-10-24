import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { SliderModule } from 'primeng/slider';
import { EditorModule } from 'primeng/editor';
import { NgxMdModule } from 'ngx-md';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FormModule as NativeFormModule } from '../../forms-ngx';

import { LanguageModule } from '../language';

import { DatePickerComponent } from './date-picker';
import { TimePickerComponent } from './time-picker';
import { MultiSelectComponent } from './multi-select';
import { RadioSelectComponent } from './radio-select';
import { DropdownSelectComponent } from './dropdown-select';
import { DynamicFormComponent } from './dynamic-form-component';
import { DynamicFormFieldComponent } from './dynamic-form-field-component';
import { DynamicFormGroupComponent } from './dynamic-form-group-component';
import { DynamicFormSectionComponent } from './dynamic-form-section-component';
import { SwitchComponent } from './switch';
import { SliderComponent } from './slider';
import { RangeSliderComponent } from './range-slider';
import { FileComponent } from './file';
import { EmojiInputComponent } from './emoji-input';
import { MarkdownComponent } from './markdown';
import { RichTextEditorComponent } from './rich-text-editor';
import { GenericUiModule } from '../features/generic-ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    RadioButtonModule,
    InputTextModule,
    FileUploadModule,
    InputSwitchModule,
    SliderModule,
    LanguageModule,
    NativeFormModule,
    FontAwesomeModule,
    NgxMdModule,
    EditorModule,
    GenericUiModule
  ],
  declarations: [
    DatePickerComponent,
    TimePickerComponent,
    MultiSelectComponent,
    RadioSelectComponent,
    DynamicFormComponent,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
    DynamicFormSectionComponent,
    DropdownSelectComponent,
    SwitchComponent,
    FileComponent,
    SliderComponent,
    RangeSliderComponent,
    EmojiInputComponent,
    MarkdownComponent,
    RichTextEditorComponent
  ],
  exports: [DynamicFormComponent]
})
export class FormModule {}

export * from '../../forms-ngx';
