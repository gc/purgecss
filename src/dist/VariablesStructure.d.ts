import type * as postcss from "postcss";
import type { StringRegExpArray } from "./types";
/**
 * @public
 */
export declare class VariableNode {
    nodes: VariableNode[];
    value: postcss.Declaration;
    isUsed: boolean;
    constructor(declaration: postcss.Declaration);
}
/**
 * @public
 */
export declare class VariablesStructure {
    nodes: Map<string, VariableNode[]>;
    usedVariables: Set<string>;
    safelist: StringRegExpArray;
    addVariable(declaration: postcss.Declaration): void;
    addVariableUsage(declaration: postcss.Declaration, matchedVariables: IterableIterator<RegExpMatchArray>): void;
    addVariableUsageInProperties(matchedVariables: IterableIterator<RegExpMatchArray>): void;
    setAsUsed(variableName: string): void;
    removeUnused(): void;
    isVariablesSafelisted(variable: string): boolean;
}
