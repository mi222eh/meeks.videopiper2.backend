import { SetInvokeFunction } from "./InvokeHandler";
import "./loggerInvokations";
import * as youtubedl from "meeks.nodejs.youtube-dl";
import * as ffmpeg from "meeks.nodejs.ffmpeg";
import lodash from "lodash";
import events from "events";
import { Log, LogError, LogInfo, LogWarning } from "./logger/logManager";

class IndexEvent extends events {
  onElectronPromise(): Promise<typeof import("electron")> {
    return new Promise((resolve, reject) => {
      if (Electron) {
        resolve(Electron);
      }
      this.once("electron", () => resolve(Electron));
    });
  }
  onElectron(fn: (electron: typeof import("electron")) => void) {
    if (Electron) {
      fn(Electron);
    }
    this.once("electron", () => fn(Electron));
  }
  fireElectron() {
    this.emit("electron");
  }
}

export let Electron: typeof import("electron") = null;
export let IndexEvents = new IndexEvent();

export async function InitElectron(electron: typeof import("electron")) {
  LogInfo("Electron set");
  Electron = electron;
  IndexEvents.fireElectron();
}

SetInvokeFunction("media/getInfo", async function (event, url: string) {
  const process = await youtubedl.Executer.getVideoInfo(url);
  this.onCancel(() => {
    process.stop();

    LogInfo("Stopping getting info of");
    LogInfo(url);
  });
  await process.promise;
  return process.data;
});

SetInvokeFunction(
  "media/download",
  async function (event, url: string, format: string, path: string) {
    const process = await youtubedl.Executer.download(url, format, path);
    this.onCancel(() => {
      process.stop();

      LogInfo("Stopping download of");
      LogInfo(path);
    });
    await process.promise;
  }
);

SetInvokeFunction(
  "media/convert",
  async function (event, src: string, output: string) {
    const process = await ffmpeg.executer.createConvertProcess(src, output);
    this.onCancel(() => {
      process.stop();
      LogInfo("Stopping convert of");
      LogInfo(output);
    });
    await process.promise;
  }
);

SetInvokeFunction(
  "media/combine",
  async function (event, srcList: string[], output: string) {
    const process = await ffmpeg.executer.createCombineProcess(srcList, output);
    this.onCancel(() => {
      LogInfo("Stopping Combine of");
      LogInfo(output);
      process.stop();
    });
    await process.promise;
  }
);

IndexEvents.onElectronPromise().then((electron) => {
  LogInfo(`Setting Log Handlers`);

  electron.ipcMain.handle("log/error", (event, message) => {
    message = `[FRONTEND]${message}`;
    LogError(message);
  });

  electron.ipcMain.handle("log/warn", (event, message) => {
    message = `[FRONTEND]${message}`;
    LogWarning(message);
  });

  electron.ipcMain.handle("log/info", (event, message) => {
    message = `[FRONTEND]${message}`;
    LogInfo(message);
  });

  LogInfo(`Registered log/info`);
  LogInfo(`Registered log/error`);
  LogInfo(`Registered log/warn`);
});
