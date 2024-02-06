import { BehaviorSubject } from 'rxjs';

export class FormService {
  private formDataSubject = new BehaviorSubject<any>(null);

  // 更新表单数据的方法，增加一个参数控制是否通知订阅者
  // 如果没有这个参数，每次formValueChange都会触发updateFormData，从而又发送通知给到Inventory那边，死循环了。只有来自外界的数据变更才需要通知
  updateFormData(newFormData: any, notify: boolean = true) {
    if (notify) {
      this.formDataSubject.next(newFormData);
    }
  }

  // 获取表单数据的Observable
  get formData$() {
    return this.formDataSubject.asObservable();
  }
}