import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChipsComponent } from './chips';
import { DatePickerComponent } from './date-picker';
import { DropdownSelectComponent } from './dropdown-select';
import { DynamicFormComponent } from './dynamic-form-component';
import { DynamicFormFieldComponent } from './dynamic-form-field-component';
import { DynamicFormGroupComponent } from './dynamic-form-group-component';
import { DynamicFormSectionComponent } from './dynamic-form-section-component';
import { EmojiInputComponent } from './emoji-input';
import { FieldControlService } from './field-control-service';
// import { FileUploadS3Component } from './file-upload-s3';
import { FileComponent } from './file';
import { MarkdownComponent } from './markdown';
import { MultiSelectComponent } from './multi-select';
import { RadioSelectComponent } from './radio-select';
import { RangeSliderComponent } from './range-slider';
import { RichTextEditorComponent } from './rich-text-editor';
import { SliderComponent } from './slider';
import { SwitchComponent } from './switch';
import { TimePickerComponent } from './time-picker';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    ChipsComponent,
    DatePickerComponent,
    TimePickerComponent,
    MultiSelectComponent,
    RadioSelectComponent,
    DynamicFormComponent,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
    DynamicFormSectionComponent,
    DropdownSelectComponent,
    FileComponent,
    SwitchComponent,
    SliderComponent,
    RangeSliderComponent,
    SwitchComponent,
    EmojiInputComponent,
    MarkdownComponent,
    RichTextEditorComponent
  ],
  providers: [FieldControlService]
})
export class FormModule {}

export * from './field';

export {
  DatePickerComponent,
  TimePickerComponent,
  MultiSelectComponent,
  RadioSelectComponent,
  DropdownSelectComponent,
  DynamicFormComponent,
  DynamicFormFieldComponent,
  DynamicFormGroupComponent,
  DynamicFormSectionComponent,
  SwitchComponent,
  SliderComponent,
  RangeSliderComponent,
  EmojiInputComponent,
  FileComponent,
  MarkdownComponent,
  RichTextEditorComponent
};
