const printed = {};
export function warnOnce(message) {
    if (printed[message])
        return;
    printed[message] = true;
    if (typeof console !== 'undefined' && console.warn) {
        console.warn(message);
    }
}
