const DB_NAME = "vesper.media.v1";
const STORE = "blobs";

type MediaRow = {
  key: string;
  blob: Blob;
  mime: string;
  savedAt: number;
};

const liveUrls = new Map<string, string>();

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function pictureKey(id: string) {
  return `picture:${id}`;
}

export function voiceKey(id: string, text: string) {
  return `voice:${id}:${text}`;
}

export async function readMedia(key: string): Promise<MediaRow | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const request = tx.objectStore(STORE).get(key);
      request.onsuccess = () => resolve((request.result as MediaRow | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

export async function writeMedia(key: string, blob: Blob, mime: string) {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ key, blob, mime, savedAt: Date.now() } satisfies MediaRow);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteMediaPrefix(prefix: string) {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await openDb();
    const keys = await new Promise<string[]>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const request = tx.objectStore(STORE).getAllKeys();
      request.onsuccess = () => resolve((request.result as IDBValidKey[]).map(String));
      request.onerror = () => reject(request.error);
    });
    const matched = keys.filter((key) => key.startsWith(prefix));
    if (matched.length === 0) return;
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      for (const key of matched) store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* the letter is already gone; leftover audio is harmless */
  }
}

export function blobFromBase64(base64: string, mime: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function localPicture(id: string, remote: string): Promise<string> {
  const cachedUrl = liveUrls.get(id);
  if (cachedUrl) return cachedUrl;
  try {
    const saved = await readMedia(pictureKey(id));
    let blob = saved?.blob ?? null;
    if (!blob) {
      const response = await fetch(remote);
      if (!response.ok) return remote;
      const fetched = await response.blob();
      if (!fetched.type.startsWith("image/") || fetched.size < 1000) return remote;
      blob = fetched;
      await writeMedia(pictureKey(id), blob, blob.type || "image/jpeg");
    }
    const url = URL.createObjectURL(blob);
    liveUrls.set(id, url);
    return url;
  } catch {
    return remote;
  }
}
