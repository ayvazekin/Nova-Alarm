import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'nova_alarm_db';
const STORE_NAME = 'videos';

export async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveVideo(id: string, blob: Blob) {
  const db = await getDB();
  await db.put(STORE_NAME, blob, id);
}

export async function saveGlobalBackground(blob: Blob) {
  const db = await getDB();
  await db.put(STORE_NAME, blob, 'global_background');
}

export async function getGlobalBackground(): Promise<Blob | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, 'global_background');
}

export async function getVideo(id: string): Promise<Blob | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function deleteVideo(id: string) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
