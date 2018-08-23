import { ControlBase } from './control-base';

export class TableControl extends ControlBase<object> {
    constructor(key: string, options: {} = {}) {
        super(key, options);
    }
}
