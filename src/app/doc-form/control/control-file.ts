import { ControlBase } from './control-base';

export class FileControl extends ControlBase<string> {
  constructor(key: string, options: {} = {}) {
    super(key, options);
  }
}
