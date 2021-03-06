import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {
  ControlBase,
  FormNControls,
  TextboxControl,
  DropdownControl,
  RadioControl,
  FileControl,
  ListControl,
  TableControl,
  FormCtrl
} from './control/control-base';

@Injectable()
export class DocFormService {
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  getFormNControls(appName: string): Promise<FormNControls> {
    return new Promise((resolve, reject) => {
      const container = 'schema';
      // this.http.get(`/api/document/download?c=${container}&p=${appName}.JSON`).subscribe((res: any) => {
      //   const data: FormNControls = this.generateFormNControls(res.schema);
      //   resolve(data);
      // });

      const res = {
        'appName': 'contracts',
        'schema': {
          'appKey': {
            'controlType': 'textbox',
            'label': 'App Key #',
            'placeholder': 'UniqueID of a Contract in Procurement application',
            'type': 'text',
            'required': true,
            'order': 0,
            'width': 6,
            'row': 1
          },
          'startDate': {
            'controlType': 'textbox',
            'label': 'Contract Start Date',
            'placeholder': 'Contract Start Date',
            'type': 'date',
            'order': 3,
            'width': 3,
            'row': 2
          },
          'endDate': {
            'controlType': 'textbox',
            'label': 'Contract End Date',
            'placeholder': 'Contract End Date',
            'type': 'date',
            'order': 4,
            'width': 3,
            'row': 2
          },
          'vendor': {
            'controlType': 'textbox',
            'label': 'Vendor Name',
            'placeholder': 'Vendor Name',
            'type': 'text',
            'order': 5,
            'width': 6,
            'row': 3
          },
          'category': {
            'controlType': 'dropdown',
            'label': 'Category',
            'placeholder': 'Select Category',
            'options': [
              {
                'key': 'Proposal',
                'value': 'Proposal'
              },
              {
                'key': 'Bids',
                'value': 'Bids'
              },
              {
                'key': 'Awards',
                'value': 'Awards'
              },
              {
                'key': 'Vendor',
                'value': 'Vendor'
              }
            ],
            'order': 6,
            'width': 3,
            'row': 4,
            'downstreamCtrl': [
              {
                'name': 'subCategory',
                'onValue': 'Awards',
                'enable': true
              }
            ]
          },
          'subCategory': {
            'controlType': 'dropdown',
            'label': 'Sub-Category',
            'placeholder': 'Select Sub-Category',
            'options': [
              {
                'key': 'Original',
                'value': 'Original'
              },
              {
                'key': 'ChangeOrder',
                'value': 'ChangeOrder'
              }
            ],
            'order': 7,
            'width': 3,
            'row': 4
          },
          'docName': {
            'controlType': 'file',
            'label': 'Document',
            'placeholder': 'Select Document',
            'file': null,
            'order': 8,
            'width': 6,
            'row': 4
          },
          'tags': {
            'controlType': 'list',
            'label': 'Tags',
            'type': 'text',
            'placeholder': 'Tags',
            'order': 9,
            'width': 6,
            'row': 5
          },
          'married': {
            'controlType': 'radio',
            'label': 'Married',
            'type': 'radio',
            'options': [
              {
                'key': 'Yes',
                'value': true
              },
              {
                'key': 'No',
                'value': false
              }
            ],
            'downstreamCtrl': [{
              'name': 'spouse',
              'showOnlyOnValue': true,
              'enable': true,
              'onValue': true
            }],
            'order': 10,
            'width': 4,
            'row': 6
          },
          'addresses': {
            'controlType': 'table',
            'viewType': 'form',
            'order': 12,
            'width': 12,
            'row': 7,
            'label': 'Address',
            'schema': {
              'street': {
                'controlType': 'textbox',
                'label': 'Street',
                'placeholder': 'Street',
                'type': 'text',
                'required': false,
                'order': 1,
                'width': 3,
                'row': 1
              },
              'city': {
                'controlType': 'textbox',
                'label': 'City',
                'placeholder': 'City',
                'type': 'text',
                'required': false,
                'order': 2,
                'width': 3,
                'row': 1
              },
              'state': {
                'controlType': 'textbox',
                'label': 'State',
                'placeholder': 'State',
                'type': 'text',
                'required': false,
                'order': 3,
                'width': 3,
                'row': 1
              },
              'zip': {
                'controlType': 'textbox',
                'label': 'Zip',
                'placeholder': 'Zip',
                'type': 'text',
                'required': false,
                'order': 4,
                'width': 3,
                'row': 2
              }
            }
          }
        }
      };

      const data: FormNControls = this.generateFormNControls(res.schema);
      console.log(data);
      resolve(data);
    });
  }

  generateFormNControls(schema: any): FormNControls {
    const form: any = {};
    const controls: ControlBase[] = [];

    Object.keys(schema).map((el) => {
      const opt = <ControlBase>schema[el];

      if (opt.controlType === 'textbox') {
        form[el] = [(opt.value || ''), (opt.required ? [Validators.required] : [])];
        controls.push(new TextboxControl(el, opt));
      } else if (opt.controlType === 'dropdown') {
        form[el] = [(opt.value || ''), (opt.required ? [Validators.required] : [])];
        controls.push(new DropdownControl(el, opt));
      } else if (opt.controlType === 'radio') {
        form[el] = [(opt.value || ''), (opt.required ? [Validators.required] : [])];
        controls.push(new RadioControl(el, opt));
      } else if (opt.controlType === 'file') {
        form[el] = [(opt.value || ''), (opt.required ? [Validators.required] : [])];
        controls.push(new FileControl(el, opt));
      } else if (opt.controlType === 'list') {
        form[el] = this.fb.array([new FormControl((opt.value || ''), (opt.required ? [Validators.required] : []))]);
        controls.push(new ListControl(el, opt));
      } else if (opt.controlType === 'form') {
        const child: FormNControls = this.generateFormNControls(opt['schema']);
        opt['schema'] = child.controls;
        controls.push(new FormCtrl(el, opt));

        form[el] = child.form;
      } else if (opt.controlType === 'table') {
        const child: FormNControls = this.generateFormNControls(opt['schema']);
        opt['schema'] = child.controls;
        controls.push(new TableControl(el, opt));

        const tbl: any[] = [child.form];
        console.log(tbl);
        form[el] = this.fb.array(tbl);
      }
    });

    const groups = controls.reduce(function (group, item) {
      const val = item['row'];
      group[val] = group[val] || [];
      group[val].push(item);
      return group; // return with key (row number) and array
    }, {});

    const SortedNGrouped = <Array<ControlBase[]>>Object.keys(groups).map(function (group) {
      return groups[group].sort((a, b) => a.order - b.order);
    });

    return new FormNControls(this.fb.group(form), SortedNGrouped);
  }

  initTable(obj: Array<ControlBase[]>) {
    const returnarray: FormGroup[] = [];
    obj.forEach((row: ControlBase[]) => {
      const line: any = {};
      row.forEach((el) => {
        line[el.key] = [(el.value || ''), (el.required ? [Validators.required] : [])];
      });
      returnarray.push(this.fb.group(line));
    });

    return returnarray;
  }

  initForm(obj: ControlBase[]) {
    const line: any = {};
    obj.forEach((el) => {
      line[el.key] = [(el.value || ''), (el.required ? [Validators.required] : [])];
    });
    return line;
  }
}


/*
'spouse': {
            'controlType': 'form',
            'label': 'Spouse',
            'schema': {
              'firstName': {
                'controlType': 'textbox',
                'label': 'First Name',
                'placeholder': 'First Name',
                'type': 'text',
                'required': false,
                'order': 1,
                'width': 6,
                'row': 1
              },
              'lastName': {
                'controlType': 'textbox',
                'label': 'Last Name',
                'placeholder': 'Last Name',
                'type': 'text',
                'order': 2,
                'width': 6,
                'row': 1
              },
              'tags': {
                'controlType': 'list',
                'label': 'Tags',
                'type': 'text',
                'placeholder': 'Tags',
                'order': 8,
                'width': 4,
                'row': 2
              },
              'addresses': {
                'controlType': 'table',
                'order': 9,
                'width': 12,
                'row': 3,
                'schema': [{
                  'street': {
                    'controlType': 'textbox',
                    'label': 'Street',
                    'placeholder': 'Street',
                    'type': 'text',
                    'required': false,
                    'order': 1,
                    'width': 2,
                    'row': 1
                  },
                  'city': {
                    'controlType': 'textbox',
                    'label': 'City',
                    'placeholder': 'City',
                    'type': 'text',
                    'required': false,
                    'order': 2,
                    'width': 2,
                    'row': 1
                  },
                  'state': {
                    'controlType': 'textbox',
                    'label': 'State',
                    'placeholder': 'State',
                    'type': 'text',
                    'required': false,
                    'order': 3,
                    'width': 2,
                    'row': 1
                  },
                  'zip': {
                    'controlType': 'textbox',
                    'label': 'Zip',
                    'placeholder': 'Zip',
                    'type': 'text',
                    'required': false,
                    'order': 4,
                    'width': 2,
                    'row': 1
                  }
                }]
              },
              'children': {
                'controlType': 'form',
                'label': 'Children',
                'schema': {
                  'firstName': {
                    'controlType': 'textbox',
                    'label': 'First Name',
                    'placeholder': 'First Name',
                    'type': 'text',
                    'required': false,
                    'order': 1,
                    'width': 6,
                    'row': 1
                  },
                  'lastName': {
                    'controlType': 'textbox',
                    'label': 'Last Name',
                    'placeholder': 'Last Name',
                    'type': 'text',
                    'order': 2,
                    'width': 6,
                    'row': 2
                  },
                  'tags': {
                    'controlType': 'list',
                    'label': 'Tags',
                    'type': 'text',
                    'placeholder': 'Tags',
                    'order': 8,
                    'width': 4,
                    'row': 3
                  }
                },
                'order': 8,
                'width': 12,
                'row': 4
              }
            },
            'order': 11,
            'width': 6,
            'row': 6
          },
*/
