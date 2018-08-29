import { FormGroup } from '@angular/forms';

export class ControlBase {
  controlType: string;
  order: number;
  width: number;
  row: number;
  value: any;
  key: string;
  label: string;
  required: boolean;
  showChild: {
    always: boolean,
    onValue: string
  };
  downstreamCtrl?: Array<{
    name: string,
    enable: boolean,
    show: boolean,
    onValue: any
  }>;
  childForm?: ChildForm;
  childTable?: ChildTable;


  constructor(key: string, options: {} = {}) {
    this.key = key || '';
    this.value = options['value'] || null;
    this.label = options['label'] || '';
    this.required = !!options['required'];
    this.order = options['order'] || 1;
    this.controlType = options['controlType'] || '';
    this.width = options['width'] || 0;
    this.row = options['row'] || 0;
    this.showChild = options['showChild'] || null;
    this.downstreamCtrl = options['downstreamCtrl'] || null;
    this.childForm = options['childForm'] || null;
    this.childTable = options['childTable'] || null;
  }
}


export class ChildForm {
  key: string;
  schema: ControlBase[];
}

export class ChildTable {
  key: string;
  schema: Array<ControlBase[]>;
}

export class FormNControls {
  form: FormGroup;
  controls: Array<ControlBase[]>;

  constructor(form: FormGroup, controls: Array<ControlBase[]>) {
    this.form = form;
    this.controls = controls;
  }
}

export class TextboxControl extends ControlBase {
  type: string;
  placeholder: string;

  constructor(key: string, options: {} = {}) {
    super(key, options);
    this.type = options['type'] || '';
    this.placeholder = options['placeholder'] || '';
  }
}

export class DropdownControl extends ControlBase {
  options: {key: string, value: string}[] = [];

  constructor(key: string, options: {} = {}) {
    super(key, options);
    this.options = options['options'] || [];
  }
}

export class RadioControl extends ControlBase {
  options: { key: string, value: string }[] = [];

  constructor(key: string, options: {} = {}) {
      super(key, options);
      this.options = options['options'] || [];
  }
}

export class FileControl extends ControlBase {
  constructor(key: string, options: {} = {}) {
    super(key, options);
  }
}

export class ListControl extends ControlBase {
  placeholder: string;

  constructor(key: string, options: {} = {}) {
    super(key, options);
    this.placeholder = options['placeholder'] || '';
  }
}

export class TableControl extends ControlBase {
  schema: Array<ControlBase[]>;

  constructor(key: string, options: {} = {}) {
      super(key, options);
      this.schema = options['schema'] || null;
  }
}

export class FormCtrl extends ControlBase {
  schema: ControlBase[];

  constructor(key: string, options: {} = {}) {
      super(key, options);
      this.schema = options['schema'] || null;
  }
}
