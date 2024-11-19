import type { ExtractorResult } from "./types";
/**
 * @public
 */
declare class ExtractorResultSets {
    private undetermined;
    private attrNames;
    private attrValues;
    private classes;
    private ids;
    private tags;
    constructor(er: ExtractorResult);
    merge(that: ExtractorResult | ExtractorResultSets): this;
    hasAttrName(name: string): boolean;
    private someAttrValue;
    hasAttrPrefix(prefix: string): boolean;
    hasAttrSuffix(suffix: string): boolean;
    hasAttrSubstr(substr: string): boolean;
    hasAttrValue(value: string): boolean;
    hasClass(name: string): boolean;
    hasId(id: string): boolean;
    hasTag(tag: string): boolean;
}
export default ExtractorResultSets;
