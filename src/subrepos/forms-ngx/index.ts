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
import { FileUploadComponent } from './file-upload';

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
    SwitchComponent,
    EmojiInputComponent,
    FileUploadComponent
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
