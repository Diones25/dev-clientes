import { BrowserWindow, app, globalShortcut } from "electron";

export const createShortcuts = (window: BrowserWindow) => {
  app.on("browser-window-focus", () => {
    globalShortcut.register("CommandOrControl+N", () => {
      //window.webContents.openDevTools({ mode: "detach" });
      window.webContents.send("new-customer");
    });

    app.on("browser-window-blur", () => {
      globalShortcut.unregisterAll();
    });

  });
}