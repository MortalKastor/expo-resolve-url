import { NativeModule, requireNativeModule } from "expo";

import { ResolveUrlModuleEvents } from "./ResolveUrl.types";

declare class ResolveUrlModule extends NativeModule<ResolveUrlModuleEvents> {
  resolve(url: string): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ResolveUrlModule>("ResolveUrl");
