import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ControlBase } from './control/control-base';
import { TextboxControl } from './control/control-textbox';
import { DropdownControl } from './control/control-dropdown';
import { RadioControl } from './control/control-radio';
import { ListControl } from './control/control-list';
import { TableControl } from './control/control-table';
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

  castSchema2Controls(schema: any): ControlBase<any>[] {
    console.log(schema);
    const controls: ControlBase<any>[] = Object.keys(schema).map((eln) => {
      const opt = <ControlBase<any>>schema[eln];
      if (opt.controlType === 'textbox') {
        return new TextboxControl(eln, opt);
      } else if (opt.controlType === 'dropdown') {
        return new DropdownControl(eln, opt);
      } else if (opt.controlType === 'radio') {
        return new RadioControl(eln, opt);
      } else if (opt.controlType === 'table') {
        console.log(opt.schema[0]);
        const xyz: ControlBase<any>[] = this.castSchema2Controls(opt.schema[0]);
        opt.schema = [];
        opt.schema.push(xyz);
        return new TableControl(eln, opt);
      } else if (opt.controlType === 'list') {
        return new ListControl(eln, opt);
      } else if (opt.controlType === 'file') {
        return new FileControl(eln, opt);
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
          const tbl: any[] = this.initTable(ctrl.childTable.value);
          obj[ctrl.childTable.key] = this.fb.array(tbl);
        }
      } else if (ctrl.controlType === 'table') {
        const tbl: any[] = this.initTable(ctrl.schema);
        obj[ctrl.key] = this.fb.array(tbl);
      } else if (ctrl.controlType === 'list') {
        const list: any[] = this.initList(ctrl.value);
      }

    });
    return this.fb.group(obj);
  }

  initList(obj: Array<string>) {
    const returnArray: FormArray[] = [];

    return returnArray;
  }

  initTable(obj: any[]) {
    const returnarray: FormGroup[] = [];
    obj.forEach(row => {
      const line: any = {};
      row.forEach((el) => {
        line[el.key] = [(el.value || ''), (el.required ? [Validators.required] : [])];
      });
      returnarray.push(this.fb.group(line));
    });

    return returnarray;
  }
}
