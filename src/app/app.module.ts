import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormService } from './form.service';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    FormFieldComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule
  ],
  providers: [
    FormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
