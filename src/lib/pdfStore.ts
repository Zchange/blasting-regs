const DB_NAME = 'blasting-regs-local'
const STORE = 'files'
const KEY = 'official-pdf'

export interface StoredPdf {
  name: string
  type: string
  size: number
  importedAt: number
  data: ArrayBuffer
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function savePdf(file: File): Promise<StoredPdf> {
  const data = await file.arrayBuffer()
  const record: StoredPdf = {
    name: file.name,
    type: file.type || 'application/pdf',
    size: file.size,
    importedAt: Date.now(),
    data,
  }
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(record, KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
  return record
}

export async function loadPdf(): Promise<StoredPdf | null> {
  const db = await openDb()
  const record = await new Promise<StoredPdf | null>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const request = tx.objectStore(STORE).get(KEY)
    request.onsuccess = () => resolve((request.result as StoredPdf | undefined) ?? null)
    request.onerror = () => reject(request.error)
  })
  db.close()
  return record
}

export async function hasPdf(): Promise<boolean> {
  const record = await loadPdfMeta()
  return Boolean(record)
}

export async function loadPdfMeta(): Promise<Omit<StoredPdf, 'data'> | null> {
  const record = await loadPdf()
  if (!record) return null
  return {
    name: record.name,
    type: record.type,
    size: record.size,
    importedAt: record.importedAt,
  }
}

export async function removePdf(): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}
