import { Container } from "./container";
import { list } from './list';
export class Rule extends Container {
    constructor(defaults) {
        super(defaults);
        this.type = 'rule';
        if (!this.nodes)
            this.nodes = [];
    }
    get selectors() {
        return list.comma(this.selector);
    }
    set selectors(values) {
        const match = this.selector ? this.selector.match(/,\s*/) : null;
        const sep = match ? match[0] : ',' + this.raw('between', 'beforeOpen');
        this.selector = values.join(sep);
    }
}
Container.registerRule(Rule);
