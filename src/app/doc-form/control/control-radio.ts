import { ControlBase } from './control-base';

export class RadioControl extends ControlBase<string> {
    options: { key: string, value: string }[] = [];

    constructor(key: string, options: {} = {}) {
        super(key, options);
        this.options = options['options'] || [];
    }
}
