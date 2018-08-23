import { ControlBase } from './control-base';

export class TextboxControl extends ControlBase<string> {
  type: string;

  constructor(key: string, options: {} = {}) {
    super(key, options);
    this.type = options['type'] || '';
  }
}
