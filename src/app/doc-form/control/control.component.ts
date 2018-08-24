import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup, Validators, FormArray
} from '@angular/forms';
import { ControlBase } from './control-base';
import { TableControl } from './control-table';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html'
})
export class ControlComponent {
  @Input() ctrl: ControlBase;
  @Input() form: FormGroup;
  @Input() showlabel: boolean;
  @Output() notify: EventEmitter<File> = new EventEmitter<File>();

  constructor(private fb: FormBuilder) {
  }

  get isValid() {
    return this.form.controls[this.ctrl.key].valid;
  }
  get controlValue() {
    const control = this.form.controls[this.ctrl.key];
    if (control) {
      return control.value;
    } else {
      return null;
    }
  }

  getKeys(obj: any) {
    return Object.keys(obj);
  }

  checkValue(value: string) {
    if (this.ctrl.downstreamCtrl) {
      this.ctrl.downstreamCtrl.forEach(el => {
        const ctrl = this.form.get(el.name);
        if (el.onValue === value) {
          if (ctrl.enabled !== el.enable) {
            if (!el.enable) {
              ctrl.setValue('');
              ctrl.disable();
            } else {
              ctrl.enable();
            }
          }
        } else {
          if (el.enable) {
            ctrl.disable();
          } else {
            ctrl.enable();
          }
        }
      });
    }
  }

  addChildTableRow() {
    const line: any = {};
    let formArray: FormArray = null;
    let newline: any = null;
    let control: any = null;
    if (this.ctrl.childTable) {
      formArray = <FormArray>(this.form.controls[this.ctrl.childTable.key]);
      control = this.ctrl.childTable;
      newline = control.value[0];
    } else {
      formArray = <FormArray>(this.form.controls[this.ctrl.key]);
      control = this.ctrl;
      newline = control.schema[0];
    }
    newline.forEach((el) => {
      line[el.key] = [(el.value || ''), (el.required ? [Validators.required] : [])];
    });
    formArray.push(this.fb.group(line));
    control.schema.push(newline);
  }

  removeChildTableRow(i: number) {
    let control: any = null;
    if (this.ctrl.childTable) {
      if (this.ctrl.childTable.schema.length !== 1) {
        control = <FormArray>(this.form.controls[this.ctrl.childTable.key]);
        control.removeAt(i);
        this.ctrl.childTable.schema.splice(i, 1);
      }
    } else {
      if (this.ctrl.schema.length !== 1) {
        control = <FormArray>(this.form.controls[this.ctrl.key]);
        control.removeAt(i);
        this.ctrl.schema.splice(i, 1);
      }
    }
  }

  onFileSelected(event) {
    const file: File = <File>event.target.files[0];
    this.ctrl.value = file.name;
    this.notify.emit(file);
  }

}

