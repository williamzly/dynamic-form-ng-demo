import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormService } from '../form.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
// 该实现的ControlValueAccessor还是不变，但是不需要validator，没有必要
export class DynamicFormComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  // 我这里简单的就考虑这个formData是一个数组，即你的fields，但实际这个应该是一个json,你用的时候注意套一层就行
  formData :any = {};
  get fields() {
    return this.formData.fields;
  }
  private formSubscription!: Subscription

  constructor(private fb: FormBuilder, private formService: FormService) {}

  ngOnInit() {
    // formService就是你的pulicationService，这里有几点和现在不一样
    // 第一是你需要把inventoryData由原本的get方式改为监听，监听怎么实现参考FormService里面，这个的用处是保证当数据变动的时候，始终都要去buildForm
    // 第二，你原来注册的监听POchange的逻辑，也应该由pulicationService来实现，总之就是把数据变动的权利交给pulicationService，而我们只监听数据变动
    this.formSubscription = this.formService.formData$.subscribe(formData => {
      // 根据formData构建表单
      console.log('listened change of form data, start buildForm', formData)
      this.buildForm(this.form, formData.fields, null);
      console.log('complete buildForm', this.form)
      this.formData = formData;
    });

    // 监听表单变化，并实时同步数据到formService，保持数据格式一致
    this.form.valueChanges.subscribe(values => {
      // 处理values以确保格式一致性
      this.processFormValues(this.fields, values);
      this.formService.updateFormData(this.formData, false); // 更新数据但不通知订阅者
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  // 这是和你的实现最大的不同地方
  // buildForm只会把应该展示的field加到control里面，其次，这个表单利用formGroup来做成树状类型
  // 原来是所有的control都在一层，现在是如果某个control下面应该有children的话，那就额外创建一个 以它的名字加上_group的子formGroup，然后chidren的control是在这个子formGroup中
  // 这样做的最大好处是，当发生值的变化的时候，直接把这个group remove掉，就不需要再去递归的删除每一个子control的子control，所有在这个group里面的control都要重新考虑是否还应该存在
  buildForm(formGroup: FormGroup, fields: any[], parentName: string | null) {
    fields.forEach(field => {
      const control = this.fb.control(field.value);
      formGroup.addControl(field.name, control);

      if (field.children) {
        const group = this.fb.group({});
        formGroup.addControl(field.name + '_group', group);
        this.updateChildrenVisibility(group, field.children, control.value, field.name);
        control.valueChanges.subscribe(value => {
          this.updateChildrenVisibility(group, field.children, value, field.name);
        });
      }
    });
  }

  updateChildrenVisibility(group: FormGroup, children: any[], parentValue: any, parentName: string) {
    children.forEach(child => {
      if (this.shouldDisplayChild(child.condition, parentValue)) {
        if (!group.contains(child.name)) {
          const control = this.fb.control(child.value);
          group.addControl(child.name, control);
          if (child.children?.length) {
            const childGroup = this.fb.group({});
            group.addControl(child.name + '_group', childGroup);
            // control只有被加入的时候才会去继续检查它的children，并且附加一个监听事件
            this.updateChildrenVisibility(childGroup, child.children, control.value, child.name);
            control.valueChanges.subscribe(value => {
              this.updateChildrenVisibility(childGroup, child.children, value, child.name);
            });
          }
        }
      } else {
        if (group.contains(child.name)) {
          group.removeControl(child.name);
          if (child.children) {
            group.removeControl(child.name + '_group');
          }
        }
      }
    });
  }

  shouldDisplayChild(condition: any[], parentValue: any): boolean {
    // 根据condition和parentValue判断子字段是否应该显示
    return condition.includes(parentValue);
  }

  // 这个flattenedFormData 是用field name和field本身作为一个object存储，因为后面我们渲染完form，form对象就不包含我们需要的一些信息了，比如这个field的type
  flattenFormData(fields: any[]): { [key: string]: any } {
    return fields.reduce((acc, field) => {
      acc[field.name] = field;
      // 递归处理嵌套结构
      Object.assign(acc, this.flattenFormData(field.children));
      return acc;
    }, {});
  }

  formControlsNames(): string[] {
    return Object.keys(this.form.controls);
  }

  processFormValues(fields: [], values: any): any {
    console.log('processFormValues', fields, values)
    if (!fields?.length || !values) return
    // 根据需要处理values以确保和formData格式一致
    // 这个地方就是你需要把form里面的value,给补充到Field中的answer中去，紧接着就会把最新的data给到publicationService
    fields.forEach((field: any) => {
        field.value = values[field.name] 
        this.processFormValues(field.children, values[field.name + '_group'])
    });
  }
}