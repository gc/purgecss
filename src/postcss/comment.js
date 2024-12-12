import { Node } from './node';
export class Comment extends Node {
    constructor(defaults) {
        super(defaults);
        this.type = 'comment';
    }
}
