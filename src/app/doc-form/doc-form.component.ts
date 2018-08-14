import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
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
  @Output() notify: EventEmitter<Object> = new EventEmitter<Object>();
  ctrls: ControlBase<any>[] = [];
  form: FormGroup;
  isFormAvailable = false;
  // payLoad = '';
  // payLoad_raw = '';
  metadata = '';
  file: File;

  constructor(private svc: DocFormService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChange fired');
    this.loadAppForm();
  }

  loadAppForm() {
    if (this.appName) {
      this.svc.getFormSchema(this.appName).then((data: any) => {
        this.ctrls = this.svc.castSchema2Controls(data.schema);
        this.form = this.svc.toFromGroup(this.ctrls);
        // console.log(this.form);
        this.isFormAvailable = true;
      });
    }
  }

  onSubmit() {
    // this.metadata = JSON.stringify(this.form.value);
    this.metadata = JSON.stringify(this.form.getRawValue());
    this.notify.emit({
      metadata: this.form.getRawValue(),
      file: this.file
    });
  }

  onNotify(event) {
    this.file = event;
  }
}
