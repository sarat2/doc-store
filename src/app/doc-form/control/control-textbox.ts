import { ControlBase } from './control-base';

export class TextboxControl extends ControlBase<string> {
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
