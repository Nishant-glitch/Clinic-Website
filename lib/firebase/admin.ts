import "server-only";
import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, type Storage } from "firebase-admin/storage";
import { serverEnv } from "@/lib/env.server";
import { clientEnv } from "@/lib/env.client";

let adminAppInstance: App | null = null;

/**
 * Initializes and retrieves the singleton Firebase Admin application using cert() credentials.
 */
export function getFirebaseAdminApp(): App {
  if (adminAppInstance) {
    return adminAppInstance;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminAppInstance = getApp();
    return adminAppInstance;
  }

  adminAppInstance = initializeApp({
    credential: cert({
      projectId: serverEnv.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: serverEnv.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: serverEnv.FIREBASE_ADMIN_PRIVATE_KEY,
    }),
    storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  return adminAppInstance;
}

let firestoreInitialized = false;

export function getAdminFirestore(): Firestore {
  const db = getFirestore(getFirebaseAdminApp());
  if (!firestoreInitialized) {
    try {
      db.settings({ ignoreUndefinedProperties: true });
      firestoreInitialized = true;
    } catch {
      // already initialized
    }
  }
  return db;
}

export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminStorage(): Storage {
  return getStorage(getFirebaseAdminApp());
}

/**
 * Dual callable + property proxy for Firestore.
 * Supports both adminDb.collection("...") and adminDb().collection("...").
 */
export const adminDb = new Proxy(getAdminFirestore, {
  get(_target, prop: string | symbol) {
    const firestore = getAdminFirestore();
    const val = (firestore as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(firestore) : val;
  },
  apply() {
    return getAdminFirestore();
  },
}) as unknown as Firestore & (() => Firestore);

/**
 * Dual callable + property proxy for Auth.
 */
export const adminAuth = new Proxy(getAdminAuth, {
  get(_target, prop: string | symbol) {
    const auth = getAdminAuth();
    const val = (auth as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(auth) : val;
  },
  apply() {
    return getAdminAuth();
  },
}) as unknown as Auth & (() => Auth);

/**
 * Dual callable + property proxy for Storage.
 */
export const adminStorage = new Proxy(getAdminStorage, {
  get(_target, prop: string | symbol) {
    const storage = getAdminStorage();
    const val = (storage as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(storage) : val;
  },
  apply() {
    return getAdminStorage();
  },
}) as unknown as Storage & (() => Storage);
