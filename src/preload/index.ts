import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Customer, NewCustomer } from '../shared/types/ipc'

// Custom APIs for renderer
const api = {
  onNewCustomer: (callback: () => void) => {
    ipcRenderer.on('new-customer', callback)

    return () => {
      ipcRenderer.off('new-customer', callback)
    }
  },
  fetchUsers: async () => {
    // INVOKE -> enviar e receber
    return await ipcRenderer.invoke('fetch-users')
  },
  addCustomer: async (doc: NewCustomer): Promise<PouchDB.Core.Response | void> => {
    // INVOKE -> enviar e receber
    return await ipcRenderer.invoke('add-customer', doc)
  },
  fetchAllCustomers: async (): Promise<Customer[]> => {
    // INVOKE -> enviar e receber
    return await ipcRenderer.invoke('fetch-all-customers')
  },
  fetchCustomerById: async (id: string): Promise<Customer> => {
    // INVOKE -> enviar e receber
    return await ipcRenderer.invoke('fetch-customer-id', id)
  },
  deleteCustomerById: async (id: string): Promise<PouchDB.Core.Response | null> => {
    // INVOKE -> enviar e receber
    return await ipcRenderer.invoke('delete-customer', id)
  },
  getVersionApp: async () => {
    // INVOKE -> enviar e receber
    return await ipcRenderer.invoke('get-version')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
