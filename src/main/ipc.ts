import { app, ipcMain } from 'electron'

ipcMain.handle('fetch-users', async () => {
  console.log('Buscando usuários')

  return [
    {
      id: 1,
      name: 'Lucas',
      email: 'lucas@example.com'
    },
    {
      id: 2,
      name: 'Matheus',
      email: 'matheus@example.com'
    }
  ]
})

ipcMain.handle('get-version', async () => {
  return app.getVersion()
})
