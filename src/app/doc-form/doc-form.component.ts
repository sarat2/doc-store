import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ControlBase, FormNControls } from './control/control-base';
import { DocFormService } from './doc-form.service';

@Component({
  selector: 'app-doc-form',
  templateUrl: './doc-form.component.html',
  providers: [DocFormService]
})
export class DocFormComponent implements OnChanges, OnInit {
  @Input() appName: string;
  @Output() notify: EventEmitter<Object> = new EventEmitter<Object>();
  ctrls: Array<ControlBase[]> = [];
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
      this.svc.getFormNControls(this.appName).then((data: FormNControls) => {
        this.ctrls = data.controls;
        this.form = data.form;
        this.isFormAvailable = true;
        // console.log(data);
        // const nv: any = {
        //   'appKey': 'Teja',
        //   'startDate': '',
        //   'endDate': '',
        //   'vendor': 'Test INC',
        //   'category': 'Proposal',
        //   'subCategory': '',
        //   'docName': '',
        //   'addresses': [
        //     {
        //       'street': '140 Prospect',
        //       'city': '',
        //       'state': '',
        //       'zip': '',
        //     },
        //     {
        //       'street': 'River rd',
        //       'city': '',
        //       'state': '',
        //       'zip': '',
        //     }]
        // };
        // this.form.patchValue(nv);

        // this.form.get('addresses').setValue([
        //   {
        //     'street': '140 Prospect',
        //     'city': '',
        //     'state': '',
        //     'zip': '',
        //   },
        //   {
        //     'street': 'River rd',
        //     'city': '',
        //     'state': '',
        //     'zip': '',
        //   }]);
      });
    }
  }

  onSubmit() {
    this.metadata = JSON.stringify(this.form.getRawValue(), null, 4);
    // this.notify.emit({
    //   metadata: this.form.getRawValue(),
    //   file: this.file
    // });
  }

  onNotify(event) {
    this.file = event;
  }
}
