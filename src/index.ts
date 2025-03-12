// Reexport the native module. On web, it will be resolved to ResolveUrlModule.web.ts
// and on native platforms to ResolveUrlModule.ts
export { default } from "./ResolveUrlModule";
export * from "./ResolveUrl.types";
