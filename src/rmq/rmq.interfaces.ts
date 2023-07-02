import { ModuleMetadata } from "@nestjs/common";

export interface IRmqOptions {
  url: string;
}

export interface IRmqModuleOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => Promise<IRmqOptions> | IRmqOptions;
  inject?: any[];
}

export interface ISendData {
  prompt: string;
  sid: string;
  history?: Record<string, Array<string>>;
}
