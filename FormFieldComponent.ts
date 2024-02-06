import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css']
})
// 这个组件不再需要判断展示什么child了，因为外层form已经按照树状结构确定了只有该显示的field会被加到form中
export class FormFieldComponent {
  @Input() formGroup: FormGroup;
  @Input() controlName: string; // 当前控件的名称
  @Input() flattenedFormData: { [key: string]: any }; // 扁平化的formData

  get fieldInfo() {
    return this.flattenedFormData[this.controlName];
  }

  isFormGroup(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control instanceof FormGroup;
  }

  getFormControlsNames(form: FormGroup): string[] {
    return Object.keys(form.controls);
  }

  // Helper method to get keys for *ngFor in template
  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}