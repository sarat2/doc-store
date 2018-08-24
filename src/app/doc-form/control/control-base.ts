export class ControlBase {
  controlType: string;
  order: number;
  width: number;
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
    onValue: any
  }>;
  childForm?: ChildForm;
  childTable?: ChildTable;
  schema?: Array<ControlBase[]>;

  constructor(key: string, options: {} = {}) {
    this.key = key || '';
    this.value = options['value'] || null;
    this.label = options['label'] || '';
    this.required = !!options['required'];
    this.order = options['order'] || 1;
    this.controlType = options['controlType'] || '';
    this.width = options['width'] || 0;
    this.showChild = options['showChild'] || null;
    this.downstreamCtrl = options['downstreamCtrl'] || null;
    this.childForm = options['childForm'] || null;
    this.childTable = options['childTable'] || null;
    this.schema = options['schema'] || null;
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
