/// <reference types="node" />
import "./loggerInvokations";
import events from "events";
declare class IndexEvent extends events {
    onElectronPromise(): Promise<typeof import("electron")>;
    onElectron(fn: (electron: typeof import("electron")) => void): void;
    fireElectron(): void;
}
export declare let Electron: typeof import("electron");
export declare let IndexEvents: IndexEvent;
export declare function InitElectron(electron: typeof import("electron")): Promise<void>;
export {};
