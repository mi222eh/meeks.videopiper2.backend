"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetInvokeFunction = exports.InvokeManager = void 0;
const tslib_1 = require("tslib");
const invokeList = [];
const events_1 = tslib_1.__importDefault(require("events"));
const _1 = require(".");
const logManager_1 = require("./logger/logManager");
class InvokeManagerEvent extends events_1.default {
    constructor() {
        super();
    }
    fireCancel() {
        this.emit("cancel");
    }
    onCancel(fn) {
        this.on("cancel", fn);
    }
}
class InvokeManager {
    constructor(channel) {
        this.channel = channel;
        this.eventEmitter = new InvokeManagerEvent();
    }
    onCancel(fn) {
        this.eventEmitter.onCancel(fn);
    }
}
exports.InvokeManager = InvokeManager;
async function SetInvokeFunction(channel, fn) {
    const electron = await _1.IndexEvents.onElectronPromise();
    electron.ipcMain.handle(channel, async (event, payload) => {
        const invokeManager = new InvokeManager(channel);
        const cancelChannel = `${payload.__key}/cancel`;
        const cancelFn = function () {
            invokeManager.eventEmitter.fireCancel();
        };
        electron.ipcMain.once(cancelChannel, cancelFn);
        const response = await Promise.resolve(fn.bind(invokeManager)(event, ...payload.__payload));
        electron.ipcMain.removeHandler(cancelChannel);
        return response;
    });
    logManager_1.LogInfo(`Registered ${channel}`);
}
exports.SetInvokeFunction = SetInvokeFunction;
// SetInvokeFunction("hej", function() {
//     this.
// })
