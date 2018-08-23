import { ControlBase } from './control-base';

export class ListControl extends ControlBase<string> {
  constructor(key: string, options: {} = {}) {
    super(key, options);
  }
}
