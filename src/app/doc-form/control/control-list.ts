import { ControlBase } from './control-base';

export class ListControl extends ControlBase<string> {
  controlType = 'table';

  constructor(options: {} = {}) {
    super(options);
  }
}
