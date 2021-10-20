import fs from "fs-extra";
import path from "path";

const SETTINGS_LOCATION = path.resolve("./videoPiperSttings.json");

export interface VideoPiperSettings {
  tempFolder: string;
}

export async function getSettings() {
  const pathExists = await fs.pathExists(SETTINGS_LOCATION);
  if (!pathExists) {
  }
}
