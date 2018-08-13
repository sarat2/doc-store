import { ControlBase } from './control-base';

export class RadioControl extends ControlBase<string> {
    options: { key: string, value: string }[] = [];

    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];
    }
}
