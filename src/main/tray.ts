import { Menu, Tray, nativeImage, BrowserWindow, app } from 'electron'
import path from 'path'

export function createTray(window: BrowserWindow) {
  const appIcon = path.join(__dirname, 'resources', 'menuTemplate.png');
  let icon = nativeImage.createFromPath(appIcon);

  const tray = new Tray(icon);

  const menu = Menu.buildFromTemplate([
    {
      label: 'Dev Clientes',
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: "Cadastrar cliente",
      click: () => {
        // Enviar mensagem do processo (main) para o processo frontend (renderer)
        window.webContents.send('new-customer')

        if (window.isMinimized()) window.restore()
        window.focus()
      }
    },
    {
      label: 'Abrir',
      click: () => {
        window.show();
      }
    },
    {
      label: 'Sair',
      role: 'quit'
    },
    {
      type: 'separator'
    },
    {
      label: 'Versão 1.0.0',
      enabled: false
    }
  ])

  tray.setToolTip('Dev Clientes')

  tray.setContextMenu(menu);
}