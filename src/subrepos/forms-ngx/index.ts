import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePickerComponent } from './date-picker';
import { MultiSelectComponent } from './multi-select';
import { RadioSelectComponent } from './radio-select';
import { DropdownSelectComponent } from './dropdown-select';
import { DynamicFormComponent } from './dynamic-form-component';
import { DynamicFormFieldComponent } from './dynamic-form-field-component';
import { DynamicFormGroupComponent } from './dynamic-form-group-component';
import { DynamicFormSectionComponent } from './dynamic-form-section-component';
import { SwitchComponent } from './switch';
import { FieldControlService } from './field-control-service';
import { EmojiInputComponent } from './emoji-input';
// import { FileUploadS3Component } from './file-upload-s3';
import { FileComponent } from './file';
import { SliderComponent } from './slider';
import { RangeSliderComponent } from './range-slider';
import { MarkdownComponent } from './markdown';
import { RichTextEditorComponent } from './rich-text-editor';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    DatePickerComponent,
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
