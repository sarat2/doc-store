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
  @Input() ctrl: ControlBase<any>;
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

        // console.log(ctrl);
        // console.log(value);
        // console.log(this.ctrl.downstreamCtrl.onValue);
        // console.log(this.ctrl.downstreamCtrl.onValue === value);

        if (el.onValue === value) {
          if (ctrl.enabled !== el.enable) {
            if (!el.enable) {
              ctrl.setValue(null);
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

      // console.log(this.ctrl.downstreamCtrl.onValue);
      // console.log((<HTMLTextAreaElement>event.target).value);
      // console.log(ctrl.value);
      // console.log(this.form.controls[this.ctrl.downstreamCtrl.name]);

      /*
      if ((<HTMLTextAreaElement>event.target).value == this.ctrl.downstreamCtrl.onValue) {
        console.log(ctrl.value);
        if (this.ctrl.downstreamCtrl.enable) {
          ctrl.enable();
        } else {
          this.form.controls[this.ctrl.downstreamCtrl.name].setValue('');
          ctrl.disable();
        }
      } else {
        if (!this.ctrl.downstreamCtrl.enable) {
          ctrl.enable();
        } else {
          this.form.controls[this.ctrl.downstreamCtrl.name].setValue('');
          ctrl.disable();
        }
      }
      */
    }
  }

  addChildTableRow() {
    const control = <FormArray>(this.form.controls[this.ctrl.childTable.key]);
    const line: any = {};
    const newline: any = this.ctrl.childTable.value[0];
    Object.entries(newline).forEach(([key, value]) => {
      line[key] = [((<ControlBase<string>>value).value || ''), ((<ControlBase<string>>value).required ? [Validators.required] : [])];
    });
    this.ctrl.childTable.value.push(newline);
    control.push(this.fb.group(line));
  }

  removeChildTableRow(i: number) {
    const control = <FormArray>this.form.controls[this.ctrl.childTable.key];
    control.removeAt(i);
  }

  onFileSelected(event) {
    const file: File = <File>event.target.files[0];
    this.ctrl.value = file.name;
    this.notify.emit(file);
  }

}

