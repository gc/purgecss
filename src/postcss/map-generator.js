import { Input } from './input';
export class MapGenerator {
    constructor(stringify, root, opts, cssString) {
        this.stringify = stringify;
        this.mapOpts = opts.map || {};
        this.root = root;
        this.opts = opts;
        this.css = cssString;
        this.originalCSS = cssString;
        this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
        this.memoizedFileURLs = new Map();
        this.memoizedPaths = new Map();
        this.memoizedURLs = new Map();
    }
    addAnnotation() {
        let content;
        if (this.isInline()) {
            content =
                'data:application/json;base64,' + this.toBase64(this.map.toString());
        }
        else if (typeof this.mapOpts.annotation === 'string') {
            content = this.mapOpts.annotation;
        }
        else if (typeof this.mapOpts.annotation === 'function') {
            content = this.mapOpts.annotation(this.opts.to, this.root);
        }
        else {
            content = this.outputFile() + '.map';
        }
        let eol = '\n';
        if (this.css.includes('\r\n'))
            eol = '\r\n';
        this.css += eol + '/*# sourceMappingURL=' + content + ' */';
    }
    applyPrevMaps() {
    }
    clearAnnotation() {
        if (this.mapOpts.annotation === false)
            return;
        if (this.root) {
            let node;
            for (let i = this.root.nodes.length - 1; i >= 0; i--) {
                node = this.root.nodes[i];
                if (node.type !== 'comment')
                    continue;
                if (node.text.startsWith('# sourceMappingURL=')) {
                    this.root.removeChild(i);
                }
            }
        }
        else if (this.css) {
            this.css = this.css.replace(/\n*\/\*#[\S\s]*?\*\/$/gm, '');
        }
    }
    generate() {
        this.clearAnnotation();
        let result = '';
        this.stringify(this.root, i => {
            result += i;
        });
        return [result];
    }
    generateMap() {
        if (this.root) {
            this.generateString();
        }
        else if (this.previous().length === 1) {
            const prev = this.previous()[0].consumer();
            prev.file = this.outputFile();
            this.map = SourceMapGenerator.fromSourceMap(prev, {
                ignoreInvalidMapping: true
            });
        }
        else {
            this.map = new SourceMapGenerator({
                file: this.outputFile(),
                ignoreInvalidMapping: true
            });
            this.map.addMapping({
                generated: { column: 0, line: 1 },
                original: { column: 0, line: 1 },
                source: this.opts.from
                    ? this.toUrl(this.path(this.opts.from))
                    : '<no source>'
            });
        }
        if (this.isSourcesContent())
            this.setSourcesContent();
        if (this.root && this.previous().length > 0)
            this.applyPrevMaps();
        if (this.isAnnotation())
            this.addAnnotation();
        if (this.isInline()) {
            return [this.css];
        }
        else {
            return [this.css, this.map];
        }
    }
    generateString() {
        this.css = '';
        this.map = new SourceMapGenerator({
            file: this.outputFile(),
            ignoreInvalidMapping: true
        });
        let line = 1;
        let column = 1;
        const noSource = '<no source>';
        const mapping = {
            generated: { column: 0, line: 0 },
            original: { column: 0, line: 0 },
            source: ''
        };
        let last, lines;
        this.stringify(this.root, (str, node, type) => {
            this.css += str;
            if (node && type !== 'end') {
                mapping.generated.line = line;
                mapping.generated.column = column - 1;
                if (node.source && node.source.start) {
                    mapping.source = this.sourcePath(node);
                    mapping.original.line = node.source.start.line;
                    mapping.original.column = node.source.start.column - 1;
                    this.map.addMapping(mapping);
                }
                else {
                    mapping.source = noSource;
                    mapping.original.line = 1;
                    mapping.original.column = 0;
                    this.map.addMapping(mapping);
                }
            }
            lines = str.match(/\n/g);
            if (lines) {
                line += lines.length;
                last = str.lastIndexOf('\n');
                column = str.length - last;
            }
            else {
                column += str.length;
            }
            if (node && type !== 'start') {
                const p = node.parent || { raws: {} };
                const childless = node.type === 'decl' || (node.type === 'atrule' && !node.nodes);
                if (!childless || node !== p.last || p.raws.semicolon) {
                    if (node.source && node.source.end) {
                        mapping.source = this.sourcePath(node);
                        mapping.original.line = node.source.end.line;
                        mapping.original.column = node.source.end.column - 1;
                        mapping.generated.line = line;
                        mapping.generated.column = column - 2;
                        this.map.addMapping(mapping);
                    }
                    else {
                        mapping.source = noSource;
                        mapping.original.line = 1;
                        mapping.original.column = 0;
                        mapping.generated.line = line;
                        mapping.generated.column = column - 1;
                        this.map.addMapping(mapping);
                    }
                }
            }
        });
    }
    isAnnotation() {
        if (this.isInline()) {
            return true;
        }
        if (typeof this.mapOpts.annotation !== 'undefined') {
            return this.mapOpts.annotation;
        }
        if (this.previous().length) {
            return this.previous().some(i => i.annotation);
        }
        return true;
    }
    isInline() {
        if (typeof this.mapOpts.inline !== 'undefined') {
            return this.mapOpts.inline;
        }
        const annotation = this.mapOpts.annotation;
        if (typeof annotation !== 'undefined' && annotation !== true) {
            return false;
        }
        if (this.previous().length) {
            return this.previous().some(i => i.inline);
        }
        return true;
    }
    isMap() {
        if (typeof this.opts.map !== 'undefined') {
            return !!this.opts.map;
        }
        return this.previous().length > 0;
    }
    isSourcesContent() {
        if (typeof this.mapOpts.sourcesContent !== 'undefined') {
            return this.mapOpts.sourcesContent;
        }
        if (this.previous().length) {
            return this.previous().some(i => i.withContent());
        }
        return true;
    }
    outputFile() {
        if (this.opts.to) {
            return this.path(this.opts.to);
        }
        else if (this.opts.from) {
            return this.path(this.opts.from);
        }
        else {
            return 'to.css';
        }
    }
    path(file) {
        return file;
    }
    previous() {
        if (!this.previousMaps) {
            this.previousMaps = [];
            if (this.root) {
                this.root.walk(node => {
                    if (node.source && node.source.input.map) {
                        const map = node.source.input.map;
                        if (!this.previousMaps.includes(map)) {
                            this.previousMaps.push(map);
                        }
                    }
                });
            }
            else {
                const input = new Input(this.originalCSS, this.opts);
                if (input.map)
                    this.previousMaps.push(input.map);
            }
        }
        return this.previousMaps;
    }
    setSourcesContent() {
        throw new Error(`setSourcesContent isnt implemented`);
    }
    sourcePath(node) {
        if (this.mapOpts.from) {
            return this.toUrl(this.mapOpts.from);
        }
        else if (this.usesFileUrls) {
            return this.toFileUrl(node.source.input.from);
        }
        else {
            return this.toUrl(this.path(node.source.input.from));
        }
    }
    toBase64(str) {
        if (Buffer) {
            return Buffer.from(str).toString('base64');
        }
        else {
            return window.btoa(unescape(encodeURIComponent(str)));
        }
    }
    toFileUrl(path) {
        const cached = this.memoizedFileURLs.get(path);
        if (cached)
            return cached;
        throw new Error('`map.absolute` option is not available in this PostCSS build');
    }
    toUrl(path) {
        const cached = this.memoizedURLs.get(path);
        if (cached)
            return cached;
        path = path.replace(/\\/g, '/');
        const url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
        this.memoizedURLs.set(path, url);
        return url;
    }
}
