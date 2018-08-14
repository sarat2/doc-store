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

  getForm(appName: string) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/metadata/' + appName).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  getFormSchema() {

    const schema = {
      appName: 'contracts',
      metadata: [
        {
          controlType: 'textbox',
          key: 'appKey',
          label: 'App Key #',
          placeholder: 'Application Entity Key/ID',
          type: 'text',
          value: '',
          required: true,
          order: 1,
          width: 8
        },
        {
          controlType: 'textbox',
          key: 'contractNo',
          label: 'Contract #',
          placeholder: 'Contract #',
          type: 'text',
          value: '',
          required: true,
          order: 2,
          width: 6
        },
        {
          controlType: 'textbox',
          key: 'fmsRegNo',
          label: 'FMS Regsitration #',
          placeholder: 'FMS Regsitration #',
          type: 'text',
          value: '',
          required: true,
          order: 3,
          width: 6
        },
        {
          controlType: 'textbox',
          key: 'startDate',
          label: 'Start Date',
          placeholder: 'Contract Start Date',
          type: 'date',
          value: '',
          order: 4,
          width: 3
        },
        {
          controlType: 'textbox',
          key: 'endDate',
          label: 'End Date',
          placeholder: 'Contract End Date',
          type: 'date',
          value: '',
          order: 5,
          width: 3
        },
        {
          controlType: 'dropdown',
          key: 'category',
          label: 'Category',
          placeholder: 'Select Category',
          options: [
            { key: 'Proposal', value: 'Proposal' },
            { key: 'Bids', value: 'Bids' },
            { key: 'Awards', value: 'Awards' },
            { key: 'Vendor', value: 'Vendor' }
          ],
          order: 5,
          width: 3,
          required: true,
          downstreamCtrl: [{
            name: 'subCategory',
            onValue: 'Awards',
            enable: true
          }, {
            name: 'vendor',
            onValue: 'Vendor',
            enable: true
          }]
        },
        {
          controlType: 'dropdown',
          key: 'subCategory',
          label: 'Sub-Category',
          placeholder: 'Select Sub-Category',
          options: [
            { key: 'Original', value: 'Original' },
            { key: 'ChangeOrder', value: 'ChangeOrder' }
          ],
          order: 5,
          width: 3
        },
        {
          controlType: 'file',
          key: 'docName',
          label: 'Document',
          value: null,
          placeholder: 'Select Document',
          file: null,
          order: 5,
          width: 6
        },
        {
          controlType: 'textbox',
          key: 'vendor',
          label: 'Vendor Name',
          placeholder: 'Vendor Name',
          type: 'text',
          value: '',
          required: true,
          order: 3,
          width: 6
        }
      ]
    };

    const controls: ControlBase<any>[] = schema.metadata.map((i) => {
      if (i.controlType === 'textbox') {
        return new TextboxControl(i);
      } else if (i.controlType === 'dropdown') {
        return new DropdownControl(i);
      } else if (i.controlType === 'file') {
        return new FileControl(i);
      }

    });
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
    return controls.sort((a, b) => a.order - b.order);
  }

  toFromGroup(controls: ControlBase<any>[]) {
    const obj: any = {};
    controls.forEach(ctrl => {
      obj[ctrl.key] = [(ctrl.value || ''), (ctrl.required ? [Validators.required] : [])];

      if (ctrl.childForm) {
        obj[ctrl.childForm.key] = this.toFromGroup(ctrl.childForm.value);
      }

      if (ctrl.childTable) {
        const list: any[] = this.initChildTable(ctrl.childTable.value);
        obj[ctrl.childTable.key] = this.fb.array(list);
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