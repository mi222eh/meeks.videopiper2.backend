const invokeList: InvokeManager[] = [];
import EventEmitter from "events";
import { IndexEvents } from ".";
import { Log, LogInfo } from "./logger/logManager";

class InvokeManagerEvent extends EventEmitter {
  constructor() {
    super();
  }
  fireCancel() {
    this.emit("cancel");
  }
  onCancel(fn: () => void) {
    this.on("cancel", fn);
  }
}

export class InvokeManager {
  eventEmitter = new InvokeManagerEvent();
  constructor(public channel: string) {}
  onCancel(fn: () => void) {
    this.eventEmitter.onCancel(fn);
  }
}

export async function SetInvokeFunction(
  channel: string,
  fn: (
    this: InvokeManager,
    event: Electron.IpcMainInvokeEvent,
    ...args: any[]
  ) => any
) {
  const electron = await IndexEvents.onElectronPromise();

  electron.ipcMain.handle(
    channel,
    async (event, payload: { __key: string; __payload: any[] }) => {
      const invokeManager = new InvokeManager(channel);
      const cancelChannel = `${payload.__key}/cancel`;
      const cancelFn = function () {
        invokeManager.eventEmitter.fireCancel();
      };
      electron.ipcMain.once(cancelChannel, cancelFn);
      const response = await Promise.resolve(
        fn.bind(invokeManager)(event, ...payload.__payload)
      );
      electron.ipcMain.removeHandler(cancelChannel);
      return response;
    }
  );
  LogInfo(`Registered ${channel}`);
}

// SetInvokeFunction("hej", function() {
//     this.
// })
