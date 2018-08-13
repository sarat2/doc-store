import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ControlBase } from './control/control-base';
import { DocFormService } from './doc-form.service';

@Component({
  selector: 'app-doc-form',
  templateUrl: './doc-form.component.html',
  providers: [DocFormService]
})
export class DocFormComponent implements OnChanges, OnInit {
  @Input() appName: string;
  ctrls: ControlBase<any>[] = [];
  form: FormGroup;
  isFormAvailable = false;
  payLoad = '';
  payLoad_raw = '';

  constructor(private svc: DocFormService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChange fired');
    this.loadAppForm();
  }

  loadAppForm() {
    if (this.appName) {
      this.svc.getForm(this.appName).then((data) => {
        console.log(data);
        this.ctrls = this.svc.getFormSchema();
        this.form = this.svc.toFromGroup(this.ctrls);
        // console.log(this.form);
        this.isFormAvailable = true;
      });
    }
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    this.payLoad_raw = JSON.stringify(this.form.getRawValue());
  }
}
