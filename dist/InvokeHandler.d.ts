/// <reference types="node" />
import EventEmitter from "events";
declare class InvokeManagerEvent extends EventEmitter {
    constructor();
    fireCancel(): void;
    onCancel(fn: () => void): void;
}
export declare class InvokeManager {
    channel: string;
    eventEmitter: InvokeManagerEvent;
    constructor(channel: string);
    onCancel(fn: () => void): void;
}
export declare function SetInvokeFunction(channel: string, fn: (this: InvokeManager, event: Electron.IpcMainInvokeEvent, ...args: any[]) => any): Promise<void>;
export {};
