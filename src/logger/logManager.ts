import { logErrorToFile, logInfoToFile, logWarningToFile } from "./logFileManager";

export enum LogType{
    Warning,
    Error,
    Info
}

export function Log(message:string, type: keyof typeof LogType){
    switch (type) {
        case 'Error':
            console.error(message);
            logErrorToFile(message);
            break;
        case 'Info':
            console.log(message);
            logInfoToFile(message);
            break;
        case 'Warning':
            console.warn(message);
            logWarningToFile(message);
            break;
    }
}

export function LogInfo(message:string){
    Log(message, 'Info')
}
export function LogWarning(message:string){
    Log(message, 'Warning')
}
export function LogError(message:string){
    Log(message, 'Error')
}
