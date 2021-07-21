"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogError = exports.LogWarning = exports.LogInfo = exports.Log = exports.LogType = void 0;
const logFileManager_1 = require("./logFileManager");
var LogType;
(function (LogType) {
    LogType[LogType["Warning"] = 0] = "Warning";
    LogType[LogType["Error"] = 1] = "Error";
    LogType[LogType["Info"] = 2] = "Info";
})(LogType = exports.LogType || (exports.LogType = {}));
function Log(message, type) {
    switch (type) {
        case 'Error':
            console.error(message);
            logFileManager_1.logErrorToFile(message);
            break;
        case 'Info':
            console.log(message);
            logFileManager_1.logInfoToFile(message);
            break;
        case 'Warning':
            console.warn(message);
            logFileManager_1.logWarningToFile(message);
            break;
    }
}
exports.Log = Log;
function LogInfo(message) {
    Log(message, 'Info');
}
exports.LogInfo = LogInfo;
function LogWarning(message) {
    Log(message, 'Warning');
}
exports.LogWarning = LogWarning;
function LogError(message) {
    Log(message, 'Error');
}
exports.LogError = LogError;
