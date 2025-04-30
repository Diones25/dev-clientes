import { app, ipcMain } from 'electron'
import PouchDb from 'pouchdb'
import path from 'node:path'
import fs from 'node:fs'
import { Customer, NewCustomer } from '../shared/types/ipc';
import { randomUUID } from 'node:crypto';

// Determinar o caminho base para o banco de dados com base no sistema operacional
let dbPath: string
if (process.platform === 'darwin') {
  // caminho para MacOS
  dbPath = path.join(app.getPath('appData'), 'devclientes', "my_db")
} else {
  // caminho para Windows 
  dbPath = path.join(app.getPath('userData'), 'my_db')
}

// Verificar e criar o diretório se não existir
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Inicializar o banco de dados PouchDB
const db = new PouchDb<Customer>(dbPath)

// Função para criar um novo cliente
async function addCustomer(doc: NewCustomer): Promise<PouchDB.Core.Response | void> {
  const id = randomUUID();
  const data: Customer = {
    ...doc,
    _id: id,
  }
  return db.put(data).then((response) => {
    console.log('Cliente adicionado com sucesso!', response);
    return response;
  }).catch((error) => {
    console.error('Erro ao adicionar cliente:', error);
  })
}

ipcMain.handle('add-customer', async (_, dock: NewCustomer) => {
  return await addCustomer(dock)
})

// Função para buscar todos os clientes
async function fetchAllCustomers(): Promise<Customer[]> {
  try {
    const result = await db.allDocs({ include_docs: true });
    return result.rows.map((row) => row.doc as Customer);
  } catch (error) {
    console.log("ERRO AO BUSCAR ", error);
    return [];
  }
}

ipcMain.handle('fetch-all-customers', async () => {
  return await fetchAllCustomers()
})

// Buscar clientes por ID
async function fetchCustomerById(id: string): Promise<Customer | null> {
  try {
    const result = await db.get(id);
    return result as Customer;
  } catch (error) {
    console.log("ERRO AO BUSCAR ", error);
    return null;
  }
}

ipcMain.handle('fetch-customer-id', async (_, id: string) => {
  return await fetchCustomerById(id)
})

// Deletar cliente pelo id
async function deleteCustomerById(id: string): Promise<PouchDB.Core.Response | null> {
  try {
    const doc = await db.get(id)
    const response = await db.remove(doc._id, doc._rev)
    return response
  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    return null
  }
}

ipcMain.handle('delete-customer', async (_, id: string) => {
  return await deleteCustomerById(id)
})