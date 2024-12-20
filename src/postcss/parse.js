import { Container } from "./container";
import { Input } from './input';
import { Parser } from './parser';
export function parse(css, opts) {
    const input = new Input(css, opts);
    const parser = new Parser(input);
    try {
        parser.parse();
    }
    catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            if (e.name === 'CssSyntaxError' && opts && opts.from) {
                if (/\.scss$/i.test(opts.from)) {
                    e.message +=
                        '\nYou tried to parse SCSS with ' +
                            'the standard CSS parser; ' +
                            'try again with the postcss-scss parser';
                }
                else if (/\.sass/i.test(opts.from)) {
                    e.message +=
                        '\nYou tried to parse Sass with ' +
                            'the standard CSS parser; ' +
                            'try again with the postcss-sass parser';
                }
                else if (/\.less$/i.test(opts.from)) {
                    e.message +=
                        '\nYou tried to parse Less with ' +
                            'the standard CSS parser; ' +
                            'try again with the postcss-less parser';
                }
            }
        }
        throw e;
    }
    return parser.root;
}
Container.registerParse(parse);
