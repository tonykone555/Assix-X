import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  QueryConstraint,
  setLogLevel
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

try {
  setLogLevel('silent');
} catch (e) {}

// Load configuration
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Initialize Firebase Client SDK safely
const app = getApps().length === 0 ? initializeApp(config) : getApp();
export const dbInstance = getFirestore(app, config.firestoreDatabaseId || undefined);

class DocumentSnapshotWrapper {
  private _snap: any;
  constructor(snap: any) {
    this._snap = snap;
  }
  get id() {
    return this._snap.id;
  }
  get exists() {
    return this._snap.exists();
  }
  data() {
    return this._snap.data();
  }
}

class QueryDocumentSnapshotWrapper extends DocumentSnapshotWrapper {
  constructor(snap: any) {
    super(snap);
  }
}

class QuerySnapshotWrapper {
  private _snap: any;
  constructor(snap: any) {
    this._snap = snap;
  }
  get docs() {
    return this._snap.docs.map((d: any) => new QueryDocumentSnapshotWrapper(d));
  }
  get empty() {
    return this._snap.empty;
  }
}

// Local fallback JSON store helper for when Firestore DB is offline or not provisioned
const localStorePath = path.join(process.cwd(), '.data', 'firestore_fallback.json');

function getLocalStore() {
  try {
    if (!fs.existsSync(path.dirname(localStorePath))) {
      fs.mkdirSync(path.dirname(localStorePath), { recursive: true });
    }
    if (fs.existsSync(localStorePath)) {
      return JSON.parse(fs.readFileSync(localStorePath, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function saveLocalStore(store: any) {
  try {
    if (!fs.existsSync(path.dirname(localStorePath))) {
      fs.mkdirSync(path.dirname(localStorePath), { recursive: true });
    }
    fs.writeFileSync(localStorePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {}
}

function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Firestore operation timed out')), ms))
  ]);
}

function removeUndefined(obj: any): any {
  if (obj === undefined || obj === null) return null;
  if (Array.isArray(obj)) return obj.map(removeUndefined);
  if (typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        clean[k] = removeUndefined(v);
      }
    }
    return clean;
  }
  return obj;
}

export class DocumentReferenceWrapper {
  public _path: string;
  public _docId: string;
  constructor(pathStr: string, docId: string) {
    this._path = pathStr;
    this._docId = docId;
  }

  get id() {
    return this._docId;
  }

  get ref() {
    return this;
  }

  collection(subCollectionName: string) {
    return new CollectionReferenceWrapper(`${this._path}/${this._docId}/${subCollectionName}`);
  }

  async get() {
    try {
      const docRef = doc(dbInstance, this._path, this._docId);
      const snap = await withTimeout(getDoc(docRef), 2500);
      return new DocumentSnapshotWrapper(snap);
    } catch (err: any) {
      // Local file fallback
      const store = getLocalStore();
      const key = `${this._path}/${this._docId}`;
      const docData = store[key];
      return new DocumentSnapshotWrapper({
        id: this._docId,
        exists: () => !!docData,
        data: () => docData || undefined
      });
    }
  }

  async set(data: any, options?: any) {
    const cleanData = removeUndefined(data);
    try {
      const docRef = doc(dbInstance, this._path, this._docId);
      if (options) {
        await withTimeout(setDoc(docRef, cleanData, options), 2000);
      } else {
        await withTimeout(setDoc(docRef, cleanData), 2000);
      }
    } catch (err: any) {
      const store = getLocalStore();
      const key = `${this._path}/${this._docId}`;
      store[key] = options?.merge ? { ...(store[key] || {}), ...cleanData } : cleanData;
      saveLocalStore(store);
    }
  }

  async update(data: any) {
    const cleanData = removeUndefined(data);
    try {
      const docRef = doc(dbInstance, this._path, this._docId);
      await withTimeout(updateDoc(docRef, cleanData), 2000);
    } catch (err: any) {
      const store = getLocalStore();
      const key = `${this._path}/${this._docId}`;
      store[key] = { ...(store[key] || {}), ...cleanData };
      saveLocalStore(store);
    }
  }

  async delete() {
    try {
      const docRef = doc(dbInstance, this._path, this._docId);
      await withTimeout(deleteDoc(docRef), 2000);
    } catch (err: any) {
      const store = getLocalStore();
      const key = `${this._path}/${this._docId}`;
      delete store[key];
      saveLocalStore(store);
    }
  }
}

class QueryWrapper {
  protected _path: string;
  protected _constraints: QueryConstraint[];
  protected _localFilters: { field: string; op: any; value: any }[];
  protected _limitCount: number | null = null;

  constructor(
    pathStr: string,
    constraints: QueryConstraint[] = [],
    localFilters: { field: string; op: any; value: any }[] = [],
    limitCount: number | null = null
  ) {
    this._path = pathStr;
    this._constraints = constraints;
    this._localFilters = localFilters;
    this._limitCount = limitCount;
  }

  where(field: string, opStr: any, value: any) {
    const c = where(field, opStr, value);
    return new QueryWrapper(
      this._path,
      [...this._constraints, c],
      [...this._localFilters, { field, op: opStr, value }],
      this._limitCount
    );
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    const c = orderBy(field, direction);
    return new QueryWrapper(
      this._path,
      [...this._constraints, c],
      this._localFilters,
      this._limitCount
    );
  }

  limit(n: number) {
    const c = limit(n);
    return new QueryWrapper(
      this._path,
      [...this._constraints, c],
      this._localFilters,
      n
    );
  }

  async get() {
    try {
      const colRef = collection(dbInstance, this._path);
      const q = query(colRef, ...this._constraints);
      const snap = await withTimeout(getDocs(q), 2500);
      return new QuerySnapshotWrapper(snap);
    } catch (err: any) {
      const store = getLocalStore();
      const prefix = `${this._path}/`;
      let docs: any[] = [];
      Object.keys(store).forEach(k => {
        if (k.startsWith(prefix)) {
          const docId = k.replace(prefix, '');
          if (!docId.includes('/')) {
            const data = store[k];
            let matches = true;
            for (const filter of this._localFilters) {
              const val = data?.[filter.field];
              if (filter.op === '==' && val !== filter.value) matches = false;
              if (filter.op === '!=' && val === filter.value) matches = false;
              if (filter.op === '>' && !(val > filter.value)) matches = false;
              if (filter.op === '>=' && !(val >= filter.value)) matches = false;
              if (filter.op === '<' && !(val < filter.value)) matches = false;
              if (filter.op === '<=' && !(val <= filter.value)) matches = false;
              if (filter.op === 'array-contains') {
                if (!Array.isArray(val) || !val.includes(filter.value)) matches = false;
              }
              if (filter.op === 'in') {
                if (!Array.isArray(filter.value) || !filter.value.includes(val)) matches = false;
              }
            }
            if (matches) {
              docs.push({
                id: docId,
                exists: () => true,
                data: () => data
              });
            }
          }
        }
      });
      if (this._limitCount !== null) {
        docs = docs.slice(0, this._limitCount);
      }
      return new QuerySnapshotWrapper({
        docs,
        empty: docs.length === 0
      });
    }
  }
}

class CollectionReferenceWrapper extends QueryWrapper {
  constructor(pathStr: string) {
    super(pathStr, [], [], null);
  }

  doc(docId?: string) {
    let finalDocId = docId;
    if (!finalDocId) {
      try {
        finalDocId = doc(collection(dbInstance, this._path)).id;
      } catch (e) {
        finalDocId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      }
    }
    return new DocumentReferenceWrapper(this._path, finalDocId);
  }

  async add(data: any) {
    try {
      const colRef = collection(dbInstance, this._path);
      const docRef = await withTimeout(addDoc(colRef, data), 2000);
      return new DocumentReferenceWrapper(this._path, docRef.id);
    } catch (err: any) {
      const fallbackId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const docRefWrapper = new DocumentReferenceWrapper(this._path, fallbackId);
      await docRefWrapper.set(data);
      return docRefWrapper;
    }
  }
}

export const db = {
  collection(collectionName: string) {
    return new CollectionReferenceWrapper(collectionName);
  },
  batch() {
    let pendingOps: { docRefWrapper: any; data?: any; type: 'set' | 'delete'; options?: any }[] = [];
    let b: any = null;
    try {
      b = writeBatch(dbInstance);
    } catch (e) {}

    return {
      set(docRefWrapper: any, data: any, options?: any) {
        const clean = removeUndefined(data);
        pendingOps.push({ docRefWrapper, data: clean, type: 'set', options });
        if (b) {
          try {
            const firestoreDocRef = doc(dbInstance, docRefWrapper._path, docRefWrapper._docId);
            if (options) {
              b.set(firestoreDocRef, clean, options);
            } else {
              b.set(firestoreDocRef, clean);
            }
          } catch (e) {}
        }
      },
      delete(docRefWrapper: any) {
        pendingOps.push({ docRefWrapper, type: 'delete' });
        if (b) {
          try {
            const firestoreDocRef = doc(dbInstance, docRefWrapper._path, docRefWrapper._docId);
            b.delete(firestoreDocRef);
          } catch (e) {}
        }
      },
      async commit() {
        let success = false;
        if (b) {
          try {
            await withTimeout(b.commit(), 3000);
            success = true;
          } catch (err: any) {}
        }
        if (!success) {
          const store = getLocalStore();
          for (const op of pendingOps) {
            const key = `${op.docRefWrapper._path}/${op.docRefWrapper._docId}`;
            if (op.type === 'set') {
              store[key] = op.options?.merge ? { ...(store[key] || {}), ...op.data } : op.data;
            } else if (op.type === 'delete') {
              delete store[key];
            }
          }
          saveLocalStore(store);
        }
      }
    };
  }
};
