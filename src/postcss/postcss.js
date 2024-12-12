import { AtRule } from './at-rule';
import { Comment } from './comment';
import { Declaration } from './declaration';
import { Root } from './root';
import { Rule } from './rule';
import { parse } from "./parse";
import { list } from "./list";
import { Input } from './input';
import { stringify } from "./stringify";
import { CssSyntaxError } from "./css-syntax-error";
import { Container } from "./container";
import { Document } from "./document";
import { Node } from "./node";
import { fromJSON } from "./fromJSON";
import { Processor } from "./processor";
import { Warning } from "./warning";
import { Result } from "./result";
import { LazyResult } from "./lazy-result";
LazyResult.registerPostcss(postcss);
function postcss(...plugins) {
    if (plugins.length === 1 && Array.isArray(plugins[0])) {
        plugins = plugins[0];
    }
    return new Processor(plugins);
}
postcss.plugin = function plugin(name, initializer) {
    let warningPrinted = false;
    function creator(...args) {
        // eslint-disable-next-line no-console
        const transformer = initializer(...args);
        transformer.postcssPlugin = name;
        transformer.postcssVersion = new Processor().version;
        return transformer;
    }
    let cache;
    Object.defineProperty(creator, 'postcss', {
        get() {
            if (!cache)
                cache = creator();
            return cache;
        }
    });
    creator.process = (css, processOpts, pluginOpts) => postcss([creator(pluginOpts)]).process(css, processOpts);
    return creator;
};
postcss.stringify = stringify;
postcss.parse = parse;
postcss.fromJSON = fromJSON;
postcss.list = list;
postcss.comment = defaults => new Comment(defaults);
postcss.atRule = defaults => new AtRule(defaults);
postcss.decl = defaults => new Declaration(defaults);
postcss.rule = defaults => new Rule(defaults);
postcss.root = defaults => new Root(defaults);
postcss.document = defaults => new Document(defaults);
postcss.CssSyntaxError = CssSyntaxError;
postcss.Declaration = Declaration;
postcss.Container = Container;
postcss.Processor = Processor;
postcss.Document = Document;
postcss.Comment = Comment;
postcss.Warning = Warning;
postcss.AtRule = AtRule;
postcss.Result = Result;
postcss.Input = Input;
postcss.Rule = Rule;
postcss.Root = Root;
postcss.Node = Node;
export default postcss;
