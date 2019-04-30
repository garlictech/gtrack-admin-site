import { NgxMdModule } from 'ngx-md';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SliderModule } from 'primeng/slider';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule as NativeFormModule } from '@bit/garlictech.angular-features.common.forms';
import { GenericUiModule } from '@bit/garlictech.angular-features.web.generic-ui-primeng';
import { LanguageModule } from '@bit/garlictech.angular-features.web.language';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DatePickerComponent } from './date-picker';
import { DropdownSelectComponent } from './dropdown-select';
import { DynamicFormComponent } from './dynamic-form-component';
import { DynamicFormFieldComponent } from './dynamic-form-field-component';
import { DynamicFormGroupComponent } from './dynamic-form-group-component';
import { DynamicFormSectionComponent } from './dynamic-form-section-component';
import { EmojiInputComponent } from './emoji-input';
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
    // GenericUiModule
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

export * from '@bit/garlictech.angular-features.common.forms';
