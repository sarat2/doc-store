import { Component, Input } from '@angular/core';
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
      const ctrl = this.form.get(this.ctrl.downstreamCtrl.name);

      // console.log(ctrl);
      // console.log(value);
      // console.log(this.ctrl.downstreamCtrl.onValue);
      // console.log(this.ctrl.downstreamCtrl.onValue === value);

      if (this.ctrl.downstreamCtrl.onValue === value) {
        if (ctrl.enabled !== this.ctrl.downstreamCtrl.enable) {
          if (!this.ctrl.downstreamCtrl.enable) {
            ctrl.setValue(null);
            ctrl.disable();
          } else {
            ctrl.enable();
          }
        }
      } else {
        if (this.ctrl.downstreamCtrl.enable) {
          ctrl.disable();
        } else {
          ctrl.enable();
        }
      }
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
    this.ctrl.file = <File>event.target.files[0];
    // console.log(this.ctrl.file);
    this.ctrl.value = this.ctrl.file.name;
  }

}

