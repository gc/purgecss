/**
 * PostCSS Plugin for PurgeCSS
 *
 * Most bundlers and frameworks to build websites are using PostCSS.
 * The easiest way to configure PurgeCSS is with its PostCSS plugin.
 *
 * @packageDocumentation
 */
import type * as postcss from "./postcss/postcss";
import type { UserDefinedOptions } from "./types";
export * from "./types";
/**
 * PostCSS Plugin for PurgeCSS
 *
 * @param opts - PurgeCSS Options
 * @returns the postCSS plugin
 *
 * @public
 */
declare const purgeCSSPlugin: postcss.PluginCreator<UserDefinedOptions>;
export default purgeCSSPlugin;
export { purgeCSSPlugin };
