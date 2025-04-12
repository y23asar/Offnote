// Minimal IndexedDB helper using idb
const dbPromise = idb.openDB('fileDB', 1, {
    upgrade(db) {
      db.createObjectStore('files');
    }
  });
  
  async function saveFileToIDB(code, content) {
    const db = await dbPromise;
    await db.put('files', content, code);
  }
  
  async function getFileFromIDB(code) {
    const db = await dbPromise;
    return db.get('files', code);
  }
