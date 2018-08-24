import { ControlBase } from './control-base';

export class RadioControl extends ControlBase {
    options: { key: string, value: string }[] = [];

    constructor(key: string, options: {} = {}) {
        super(key, options);
        this.options = options['options'] || [];
    }
}
