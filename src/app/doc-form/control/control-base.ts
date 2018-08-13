export class ControlBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  width: number;
  showChild: {
    always: boolean,
    onValue: string
  };
  downstreamCtrl?: {
    name: string,
    enable: boolean,
    onValue: any
  };
  childForm?: ChildForm;
  childTable?: ChildTable;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    width?: number,
    showChild?: {
      always: boolean,
      onValue: any
    },
    downstreamCtrl?: {
      name: string,
      enable: boolean,
      onValue: any
    }
    childForm?: ChildForm,
    childTable?: ChildTable;
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.width = options.width || 0;
    this.showChild = options.showChild || null;
    this.downstreamCtrl = options.downstreamCtrl || null;
    this.childForm = options.childForm || null;
    this.childTable = options.childTable || null;
  }
}


export class ChildForm {
  key: string;
  value: ControlBase<any>[];
}

export class ChildTable {
  key: string;
  value: any[];
}
