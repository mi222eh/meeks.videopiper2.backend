"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitElectron = exports.IndexEvents = exports.Electron = void 0;
const tslib_1 = require("tslib");
const InvokeHandler_1 = require("./InvokeHandler");
require("./loggerInvokations");
const youtubedl = tslib_1.__importStar(require("meeks.nodejs.youtube-dl"));
const ffmpeg = tslib_1.__importStar(require("meeks.nodejs.ffmpeg"));
const events_1 = tslib_1.__importDefault(require("events"));
const logManager_1 = require("./logger/logManager");
class IndexEvent extends events_1.default {
    onElectronPromise() {
        return new Promise((resolve, reject) => {
            if (exports.Electron) {
                resolve(exports.Electron);
            }
            this.once("electron", () => resolve(exports.Electron));
        });
    }
    onElectron(fn) {
        if (exports.Electron) {
            fn(exports.Electron);
        }
        this.once("electron", () => fn(exports.Electron));
    }
    fireElectron() {
        this.emit("electron");
    }
}
exports.Electron = null;
exports.IndexEvents = new IndexEvent();
async function InitElectron(electron) {
    logManager_1.LogInfo("Electron set");
    exports.Electron = electron;
    exports.IndexEvents.fireElectron();
}
exports.InitElectron = InitElectron;
InvokeHandler_1.SetInvokeFunction("media/getInfo", async function (event, url) {
    const process = await youtubedl.Executer.getVideoInfo(url);
    this.onCancel(() => {
        process.stop();
        logManager_1.LogInfo("Stopping getting info of");
        logManager_1.LogInfo(url);
    });
    await process.promise;
    return process.data;
});
InvokeHandler_1.SetInvokeFunction("media/download", async function (event, url, format, path) {
    const process = await youtubedl.Executer.download(url, format, path);
    this.onCancel(() => {
        process.stop();
        logManager_1.LogInfo("Stopping download of");
        logManager_1.LogInfo(path);
    });
    await process.promise;
});
InvokeHandler_1.SetInvokeFunction("media/convert", async function (event, src, output) {
    const process = await ffmpeg.executer.createConvertProcess(src, output);
    this.onCancel(() => {
        process.stop();
        logManager_1.LogInfo("Stopping convert of");
        logManager_1.LogInfo(output);
    });
    await process.promise;
});
InvokeHandler_1.SetInvokeFunction("media/combine", async function (event, srcList, output) {
    const process = await ffmpeg.executer.createCombineProcess(srcList, output);
    this.onCancel(() => {
        logManager_1.LogInfo("Stopping Combine of");
        logManager_1.LogInfo(output);
        process.stop();
    });
    await process.promise;
});
exports.IndexEvents.onElectronPromise().then((electron) => {
    logManager_1.LogInfo(`Setting Log Handlers`);
    electron.ipcMain.handle("log/error", (event, message) => {
        message = `[FRONTEND]${message}`;
        logManager_1.LogError(message);
    });
    electron.ipcMain.handle("log/warn", (event, message) => {
        message = `[FRONTEND]${message}`;
        logManager_1.LogWarning(message);
    });
    electron.ipcMain.handle("log/info", (event, message) => {
        message = `[FRONTEND]${message}`;
        logManager_1.LogInfo(message);
    });
    logManager_1.LogInfo(`Registered log/info`);
    logManager_1.LogInfo(`Registered log/error`);
    logManager_1.LogInfo(`Registered log/warn`);
});
