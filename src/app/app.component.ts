import { Component } from '@angular/core';
import { FormService } from './form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private formService: FormService) {}
  
  ngOnInit() {
    this.formService.updateFormData(
      {
        po: 'a',
        fields: [
          {
            name: '1',
            value: null,
            type: 'text',
            condition: [],
            children: [
              {
                name: '1.1',
                value: null,
                type: 'text',
                condition: ['A'],
                children: [
                  {
                    name: '1.1.1',
                    value: null,
                    type: 'text',
                    condition: ['A'],
                    children: []
                  },
                ]
              },
              {
                name: '1.2',
                value: null,
                type: 'text',
                condition: ['A', 'B'],
                children: []
              },
            ]
          },
          {
            name: '2',
            value: null,
            type: 'text',
            condition: [],
            children: []
          },
          {
            name: '3',
            value: null,
            type: 'text',
            condition: [],
            children: []
          },
        ]
      }
    )
  }

  getJsonData() {
    return JSON.stringify(this.formService.formData, null, 4)
  }

}
