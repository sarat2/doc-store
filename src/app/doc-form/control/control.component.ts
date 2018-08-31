import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup, Validators, FormArray
} from '@angular/forms';
import { ControlBase } from './control-base';

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
        const child = this.form.get(el.name);
        if (el.onValue === value) {
          if (child.enabled !== el.enable) {
            if (!el.enable) {
              child.setValue('');
              child.disable();
            } else {
              child.enable();
            }
          }
        } else {
          if (el.enable) {
            child.setValue('');
            child.disable();
          } else {
            child.enable();
          }
        }
      });
    }
  }

  addChildTableRow() {
    const line: any = {};
    const formArray: FormArray = <FormArray>(this.form.controls[this.ctrl.key]);
    this.ctrl['schema'].forEach((el) => {
      if (el instanceof Array) {
        el.forEach((cel) => {
          line[cel.key] = [(cel.value || ''), (cel.required ? [Validators.required] : [])];
        });
      } else {
        line[el.key] = [(el.value || ''), (el.required ? [Validators.required] : [])];
      }
    });
    formArray.push(this.fb.group(line));
  }

  removeChildTableRow(i: number) {
    const formArray: FormArray = <FormArray>(this.form.controls[this.ctrl.key]);
    formArray.removeAt(i);
  }

  onFileSelected(event) {
    const file: File = <File>event.target.files[0];
    this.ctrl.value = file.name;
    this.notify.emit(file);
  }

  addListItem() {
    const list = <FormArray>this.form.controls[this.ctrl.key];
    list.push(new FormControl(null));
  }

  removeListItem(index) {
    const list = <FormArray>this.form.controls[this.ctrl.key];
    if (list.length !== 1) {
      list.removeAt(index);
    }
  }

}

