/**
 * Core package of PurgeCSS
 *
 * Contains the core methods to analyze the files, remove unused CSS.
 *
 * @packageDocumentation
 */
import * as postcss from "./postcss/postcss";
import ExtractorResultSets from "./ExtractorResultSets";
import { defaultOptions } from "./options";
import type { ComplexSafelist, ExtractorResultDetailed, Extractors, Options, PostCSSRoot, RawContent, RawCSS, ResultPurge, UserDefinedOptions, UserDefinedSafelist } from "./types";
import { VariablesStructure } from "./VariablesStructure";
export * from "./types";
export { defaultOptions, ExtractorResultSets, PurgeCSS, VariablesStructure };
export * from "./VariablesStructure";
/**
 * Format the user defined safelist into a standardized safelist object
 *
 * @param userDefinedSafelist - the user defined safelist
 * @returns the formatted safelist object that can be used in the PurgeCSS options
 *
 * @public
 */
export declare function standardizeSafelist(userDefinedSafelist?: UserDefinedSafelist): Required<ComplexSafelist>;
/**
 * Merge two extractor selectors
 *
 * @param extractorSelectorsA - extractor selectors A
 * @param extractorSelectorsB - extractor selectors B
 * @returns  the merged extractor result sets
 *
 * @public
 */
export declare function mergeExtractorSelectors(...extractors: (ExtractorResultDetailed | ExtractorResultSets)[]): ExtractorResultSets;
/**
 * Class used to instantiate PurgeCSS and can then be used
 * to purge CSS files.
 *
 * @example
 * ```ts
 * await new PurgeCSS().purge({
 *    content: ['index.html'],
 *    css: ['css/app.css']
 * })
 * ```
 *
 * @public
 */
declare class PurgeCSS {
    private ignore;
    private atRules;
    private usedAnimations;
    private usedFontFaces;
    selectorsRemoved: Set<string>;
    removedNodes: postcss.Node[];
    variablesStructure: VariablesStructure;
    options: Options;
    private collectDeclarationsData;
    /**
     * Get the extractor corresponding to the extension file
     * @param filename - Name of the file
     * @param extractors - Array of extractors definition
     */
    private getFileExtractor;
    /**
     * Extract the selectors present in the passed string using a PurgeCSS extractor
     *
     * @param content - Array of content
     * @param extractors - Array of extractors
     */
    extractSelectorsFromString(content: RawContent[], extractors: Extractors[]): Promise<ExtractorResultSets>;
    /**
     * Evaluate at-rule and register it for future reference
     * @param node - node of postcss AST
     */
    private evaluateAtRule;
    /**
     * Evaluate css selector and decide if it should be removed or not
     *
     * @param node - node of postcss AST
     * @param selectors - selectors used in content files
     */
    private evaluateRule;
    /**
     * Get the purged version of the css based on the files
     *
     * @param cssOptions - css options, files or raw strings
     * @param selectors - set of extracted css selectors
     */
    getPurgedCSS(cssOptions: Array<string | RawCSS>, selectors: ExtractorResultSets): Promise<ResultPurge[]>;
    /**
     * Check if the keyframe is safelisted with the option safelist keyframes
     *
     * @param keyframesName - name of the keyframe animation
     */
    private isKeyframesSafelisted;
    /**
     * Check if the selector is blocklisted with the option blocklist
     *
     * @param selector - css selector
     */
    private isSelectorBlocklisted;
    /**
     * Check if the selector is safelisted with the option safelist standard
     *
     * @param selector - css selector
     */
    private isSelectorSafelisted;
    /**
     * Check if the selector is safelisted with the option safelist deep
     *
     * @param selector - selector
     */
    private isSelectorSafelistedDeep;
    /**
     * Check if the selector is safelisted with the option safelist greedy
     *
     * @param selector - selector
     */
    private isSelectorSafelistedGreedy;
    /**
     * Remove unused CSS
     *
     * @param userOptions - PurgeCSS options or path to the configuration file
     * @returns an array of object containing the filename and the associated CSS
     *
     * @example Using a configuration file named purgecss.config.js
     * ```ts
     * const purgeCSSResults = await new PurgeCSS().purge()
     * ```
     *
     * @example Using a custom path to the configuration file
     * ```ts
     * const purgeCSSResults = await new PurgeCSS().purge('./purgecss.config.js')
     * ```
     *
     * @example Using the PurgeCSS options
     * ```ts
     * const purgeCSSResults = await new PurgeCSS().purge({
     *    content: ['index.html', '**\/*.js', '**\/*.html', '**\/*.vue'],
     *    css: ['css/app.css']
     * })
     * ```
     */
    purge(userOptions: UserDefinedOptions | string | undefined): Promise<ResultPurge[]>;
    /**
     * Remove unused CSS variables
     */
    removeUnusedCSSVariables(): void;
    /**
     * Remove unused font-faces
     */
    removeUnusedFontFaces(): void;
    /**
     * Remove unused keyframes
     */
    removeUnusedKeyframes(): void;
    /**
     * Transform a selector node into a string
     */
    private getSelectorValue;
    /**
     * Determine if the selector should be kept, based on the selectors found in the files
     *
     * @param selector - set of css selectors found in the content files or string
     * @param selectorsFromExtractor - selectors in the css rule
     *
     * @returns true if the selector should be kept in the processed CSS
     */
    private shouldKeepSelector;
    /**
     * Walk through the CSS AST and remove unused CSS
     *
     * @param root - root node of the postcss AST
     * @param selectors - selectors used in content files
     */
    walkThroughCSS(root: PostCSSRoot, selectors: ExtractorResultSets): void;
}
