import {Command} from "@tauri-apps/api/shell";
import {downloadDir} from "@tauri-apps/api/path";

export async function showFileInExplorer(filename:string) {
    const downloadDirPath = await downloadDir()
    const path = downloadDirPath+filename
    console.log(path)
    const command = new Command('open-explorer',['/select,',path])
    command.execute().finally()
}
