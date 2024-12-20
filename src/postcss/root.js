import { Container } from "./container";
let LazyResult, Processor;
export class Root extends Container {
    constructor(defaults) {
        super(defaults);
        this.type = 'root';
        if (!this.nodes)
            this.nodes = [];
    }
    normalize(child, sample, type) {
        const nodes = super.normalize(child);
        if (sample) {
            if (type === 'prepend') {
                if (this.nodes.length > 1) {
                    sample.raws.before = this.nodes[1].raws.before;
                }
                else {
                    delete sample.raws.before;
                }
            }
            else if (this.first !== sample) {
                for (const node of nodes) {
                    node.raws.before = sample.raws.before;
                }
            }
        }
        return nodes;
    }
    removeChild(child, ignore) {
        const index = this.index(child);
        if (!ignore && index === 0 && this.nodes.length > 1) {
            this.nodes[1].raws.before = this.nodes[index].raws.before;
        }
        return super.removeChild(child);
    }
    toResult(opts = {}) {
        const lazy = new LazyResult(new Processor(), this, opts);
        return lazy.stringify();
    }
    static registerLazyResult = dependant => {
        LazyResult = dependant;
    };
    static registerProcessor = dependant => {
        Processor = dependant;
    };
}
Container.registerRoot(Root);
