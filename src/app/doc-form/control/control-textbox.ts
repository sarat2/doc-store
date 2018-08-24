import { ControlBase } from './control-base';

export class TextboxControl extends ControlBase {
  type: string;
  placeholder: string;

  constructor(key: string, options: {} = {}) {
    super(key, options);
    this.type = options['type'] || '';
    this.placeholder = options['placeholder'] || '';
  }
}
