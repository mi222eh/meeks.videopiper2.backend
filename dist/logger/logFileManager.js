"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfoToFile = exports.logWarningToFile = exports.logErrorToFile = void 0;
const tslib_1 = require("tslib");
const format_1 = tslib_1.__importDefault(require("date-fns/format"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const LoggerFolder = path_1.default.resolve('./Logs');
function getCurrentDateText() {
    return format_1.default(new Date(), 'yyyy-MM-dd');
}
function getTime() {
    return format_1.default(new Date(), 'HH:mm:ss');
}
function logErrorToFile(message) {
    message = `[ERROR]${message}`;
    writeToLogFile(message);
}
exports.logErrorToFile = logErrorToFile;
function logWarningToFile(message) {
    message = `[WARNING]${message}`;
    writeToLogFile(message);
}
exports.logWarningToFile = logWarningToFile;
function logInfoToFile(message) {
    message = `[INFO]${message}`;
    writeToLogFile(message);
}
exports.logInfoToFile = logInfoToFile;
async function writeToLogFile(message) {
    message = `[${getTime()}]${message}`;
    if (!await fs_extra_1.default.pathExists(LoggerFolder)) {
        await fs_extra_1.default.mkdirp(LoggerFolder);
    }
    const logFile = path_1.default.join(LoggerFolder, `${getCurrentDateText()}.log.txt`);
    if (!await fs_extra_1.default.pathExists(logFile)) {
        await fs_extra_1.default.createFile(logFile);
    }
    fs_extra_1.default.appendFile(logFile, '\n' + message);
}
