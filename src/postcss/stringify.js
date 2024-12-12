import { Stringifier } from "./stringifier";
export function stringify(node, builder) {
    const str = new Stringifier(builder);
    str.stringify(node);
}
