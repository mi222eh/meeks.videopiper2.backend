export declare enum LogType {
    Warning = 0,
    Error = 1,
    Info = 2
}
export declare function Log(message: string, type: keyof typeof LogType): void;
export declare function LogInfo(message: string): void;
export declare function LogWarning(message: string): void;
export declare function LogError(message: string): void;
