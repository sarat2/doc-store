import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ControlBase,
         FormNControls,
         TextboxControl,
         DropdownControl,
         RadioControl,
         FileControl,
         ListControl,
         TableControl } from './control/control-base';

@Injectable()
export class DocFormService {
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  getFormNControls(appName: string): Promise<FormNControls> {
    return new Promise((resolve, reject) => {
      const container = 'schema';
      this.http.get(`/api/document/download?c=${container}&p=${appName}.JSON`).subscribe((res: any) => {
        const data: FormNControls = this.generateFormNControls(res.schema);
        resolve(data);
      });
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
      } else if (opt.controlType === 'table') {
        form[el] = [(opt.value || ''), (opt.required ? [Validators.required] : [])];
        // console.log(opt.schema[0]);
        const child: FormNControls = this.generateFormNControls(opt.schema[0]);
        opt.schema = [];
        opt.schema.push(child.controls);
        controls.push(new TableControl(el, opt));

        const tbl: any[] = this.initTable(opt.schema);
        form[el] = this.fb.array(tbl);

      } else if (opt.controlType === 'list') {
        form[el] = [(opt.value || ''), (opt.required ? [Validators.required] : [])];
        controls.push(new ListControl(el, opt));
      } else if (opt.controlType === 'file') {
        form[el] = [(opt.value || ''), (opt.required ? [Validators.required] : [])];
        controls.push(new FileControl(el, opt));
      }
    });

    return new FormNControls(this.fb.group(form), controls.sort((a, b) => a.order - b.order));
  }

  initList(obj: Array<string>) {
    const returnArray: FormArray[] = [];

    return returnArray;
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
}
