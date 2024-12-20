import { CssSyntaxError } from "./css-syntax-error";
const fromOffsetCache = Symbol('fromOffsetCache');
export class Input {
    constructor(css, opts = {}) {
        if (css === null ||
            typeof css === 'undefined' ||
            (typeof css === 'object' && !css.toString)) {
            throw new Error(`PostCSS received ${css} instead of CSS string`);
        }
        this.css = css.toString();
        if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
            this.hasBOM = true;
            this.css = this.css.slice(1);
        }
        else {
            this.hasBOM = false;
        }
        if (this.map)
            this.map.file = this.from;
    }
    error(message, line, column, opts = {}) {
        let endColumn, endLine, result;
        if (line && typeof line === 'object') {
            const start = line;
            const end = column;
            if (typeof start.offset === 'number') {
                const pos = this.fromOffset(start.offset);
                line = pos.line;
                column = pos.col;
            }
            else {
                line = start.line;
                column = start.column;
            }
            if (typeof end.offset === 'number') {
                const pos = this.fromOffset(end.offset);
                endLine = pos.line;
                endColumn = pos.col;
            }
            else {
                endLine = end.line;
                endColumn = end.column;
            }
        }
        else if (!column) {
            const pos = this.fromOffset(line);
            line = pos.line;
            column = pos.col;
        }
        const origin = this.origin(line, column, endLine, endColumn);
        if (origin) {
            result = new CssSyntaxError(message, origin.endLine === undefined
                ? origin.line
                : { column: origin.column, line: origin.line }, origin.endLine === undefined
                ? origin.column
                : { column: origin.endColumn, line: origin.endLine }, origin.source, origin.file, opts.plugin);
        }
        else {
            result = new CssSyntaxError(message, endLine === undefined ? line : { column, line }, endLine === undefined ? column : { column: endColumn, line: endLine }, this.css, this.file, opts.plugin);
        }
        result.input = { column, endColumn, endLine, line, source: this.css };
        if (this.file) {
            result.input.file = this.file;
        }
        return result;
    }
    fromOffset(offset) {
        let lastLine, lineToIndex;
        if (!this[fromOffsetCache]) {
            const lines = this.css.split('\n');
            lineToIndex = new Array(lines.length);
            let prevIndex = 0;
            for (let i = 0, l = lines.length; i < l; i++) {
                lineToIndex[i] = prevIndex;
                prevIndex += lines[i].length + 1;
            }
            this[fromOffsetCache] = lineToIndex;
        }
        else {
            lineToIndex = this[fromOffsetCache];
        }
        lastLine = lineToIndex[lineToIndex.length - 1];
        let min = 0;
        if (offset >= lastLine) {
            min = lineToIndex.length - 1;
        }
        else {
            let max = lineToIndex.length - 2;
            let mid;
            while (min < max) {
                mid = min + ((max - min) >> 1);
                if (offset < lineToIndex[mid]) {
                    max = mid - 1;
                }
                else if (offset >= lineToIndex[mid + 1]) {
                    min = mid + 1;
                }
                else {
                    min = mid;
                    break;
                }
            }
        }
        return {
            col: offset - lineToIndex[min] + 1,
            line: min + 1
        };
    }
    origin(line, column, endLine, endColumn) {
        if (!this.map)
            return false;
        const consumer = this.map.consumer();
        const from = consumer.originalPositionFor({ column, line });
        if (!from.source)
            return false;
        let to;
        if (typeof endLine === 'number') {
            to = consumer.originalPositionFor({ column: endColumn, line: endLine });
        }
        let fromUrl;
        fromUrl = new URL(from.source, this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile));
        const result = {
            column: from.column,
            endColumn: to && to.column,
            endLine: to && to.line,
            line: from.line,
            url: fromUrl.toString()
        };
        const source = consumer.sourceContentFor(from.source);
        if (source)
            result.source = source;
        return result;
    }
    toJSON() {
        const json = {};
        for (const name of ['hasBOM', 'css', 'file', 'id']) {
            if (this[name] != null) {
                json[name] = this[name];
            }
        }
        if (this.map) {
            json.map = { ...this.map };
            if (json.map.consumerCache) {
                json.map.consumerCache = undefined;
            }
        }
        return json;
    }
    get from() {
        return this.file || this.id;
    }
}
