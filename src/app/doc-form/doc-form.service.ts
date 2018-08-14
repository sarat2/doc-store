import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ControlBase } from './control/control-base';
import { TextboxControl } from './control/control-textbox';
import { DropdownControl } from './control/control-dropdown';
import { RadioControl } from './control/control-radio';
import { ListControl } from './control/control-list';
import { FileControl } from './control/control-file';

@Injectable()
export class DocFormService {
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  getFormSchema(appName: string) {
    return new Promise((resolve, reject) => {
      const container = 'schema';
      this.http.get(`/api/document/download?c=${container}&p=${appName}.JSON`).subscribe(res => {
        resolve(res);
      });
    });
  }

  castSchema2Controls(schema: Array<any>) {
    const controls: ControlBase<any>[] = schema.map((i) => {
      if (i.controlType === 'textbox') {
        return new TextboxControl(i);
      } else if (i.controlType === 'dropdown') {
        return new DropdownControl(i);
      } else if (i.controlType === 'radio') {
        return new RadioControl(i);
      } else if (i.controlType === 'list') {
        return new ListControl(i);
      } else if (i.controlType === 'file') {
        return new FileControl(i);
      }
    });

    return controls.sort((a, b) => a.order - b.order);
  }

  toFromGroup(controls: ControlBase<any>[]) {
    const obj: any = {};
    controls.forEach(ctrl => {
      if (['textbox', 'dropdown', 'radio', 'file'].includes(ctrl.controlType)) {
        obj[ctrl.key] = [(ctrl.value || ''), (ctrl.required ? [Validators.required] : [])];

        if (ctrl.childForm) {
          obj[ctrl.childForm.key] = this.toFromGroup(ctrl.childForm.value);
        }

        if (ctrl.childTable) {
          const list: any[] = this.initChildTable(ctrl.childTable.value);
          obj[ctrl.childTable.key] = this.fb.array(list);
        }
      } else if (ctrl.controlType === 'list') {

      }

    });
    return this.fb.group(obj);
  }

  initChildTable(obj: any[]) {
    const returnarray: FormGroup[] = [];
    obj.forEach(item => {
      const line: any = {};
      Object.entries(item).forEach(([key, value]) => {
        line[key] = [((<ControlBase<string>>value).value || ''), ((<ControlBase<string>>value).required ? [Validators.required] : [])];
      });
      returnarray.push(this.fb.group(line));
    });
    return returnarray;
  }
}


/*
    const controls: ControlBase<any>[] = [

      new TextboxControl({
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        value: 'Sarat',
        required: true,
        order: 1,
        width: 6
      }),

      new TextboxControl({
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        value: 'Annapaneni',
        order: 2,
        width: 6
      }),

      new RadioControl({
        key: 'married',
        label: 'Married?',
        options: [
          { key: 'Yes', value: 'true' },
          { key: 'No', value: 'false' }
        ],
        order: 3,
        width: 12,
        showChild: {
          always: false,
          onValue: 'true'
        },
        childForm: {
          key: 'spouse',
          value: [
            new TextboxControl({
              key: 'FirstName',
              label: 'Spouse First Name',
              value: '',
              required: false,
              order: 1,
              width: 6,
            }),

            new TextboxControl({
              key: 'LastName',
              label: 'Spouse Last Name',
              value: '',
              required: false,
              order: 2,
              width: 6,
            })
          ]
        }
      }),

      new RadioControl({
        key: 'hasChildren',
        label: 'Children?',
        options: [
          { key: 'Yes', value: 'true' },
          { key: 'No', value: 'false' }
        ],
        order: 3,
        width: 12,
        showChild: {
          always: false,
          onValue: 'true'
        },
        childTable: {
          key: 'children',
          value: [{
            firstName:
              new TextboxControl({
                key: 'firstName',
                label: 'First Name',
                type: 'text',
                required: false,
                order: 1
              }),
            lastName:
              new TextboxControl({
                key: 'lastName',
                label: 'Last Name',
                type: 'text',
                required: false,
                order: 2
              }),
            dob:
              new TextboxControl({
                key: 'dob',
                label: 'DOB',
                type: 'date',
                required: false,
                order: 3
              }),
            test:
              new DropdownControl({
                key: 'test',
                label: 'Test',
                options: [
                  { key: 'solid', value: 'Solid' },
                  { key: 'great', value: 'Great' },
                  { key: 'good', value: 'Good' },
                  { key: 'unproven', value: 'Unproven' }
                ],
                order: 5,
                downstreamCtrl: {
                  name: 'dob',
                  enable: false,
                  onValue: 'solid'
                }
              })
          }]
        }
      }),

      new TextboxControl({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 4,
        width: 10
      }),

      new DropdownControl({
        key: 'rating',
        label: 'Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 5,
        width: 3,
        downstreamCtrl: {
          name: 'ratingNotes',
          enable: false,
          onValue: 'solid'
        }
      }),

      new TextboxControl({
        key: 'ratingNotes',
        label: 'Rating Notes',
        type: 'text',
        required: false,
        order: 6,
        width: 7
      }),

      // new ListControl({
      //   key: 'tblChildren',
      //   label: 'Children',
      //   required: false,
      //   order: 6,
      //   value: [{
      //     firstName: new TextboxControl({
      //       key: 'tblChildren.firstName',
      //       label: 'First Name',
      //       type: 'text',
      //       required: false,
      //       order: 1
      //     }),
      //     lastName: new TextboxControl({
      //       key: 'tblChildren.lastName',
      //       label: 'Last Name',
      //       type: 'text',
      //       required: false,
      //       order: 2
      //     }),
      //     dbo: new TextboxControl({
      //       key: 'tblChildren.dbo',
      //       label: 'DOB',
      //       type: 'date',
      //       required: false,
      //       order: 3
      //     })
      //   }]

      // })
    ];
    */
