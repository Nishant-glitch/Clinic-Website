import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { clientEnv } from "@/lib/env.client";

let clientAppInstance: FirebaseApp | null = null;

/**
 * Initializes and retrieves the singleton Firebase client application.
 * Note: Per architecture rules, Client SDK is used ONLY for admin login and admin image upload.
 */
export function getFirebaseClientApp(): FirebaseApp {
  if (clientAppInstance) {
    return clientAppInstance;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    clientAppInstance = getApp();
    return clientAppInstance;
  }

  clientAppInstance = initializeApp({
    apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
  });

  return clientAppInstance;
}

// Transparent lazy proxies to ensure app initialization on demand without build-time crashes
export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop: string | symbol) {
    const instance = getAuth(getFirebaseClientApp());
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(instance) : val;
  },
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop: string | symbol) {
    const instance = getFirestore(getFirebaseClientApp());
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(instance) : val;
  },
});

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_target, prop: string | symbol) {
    const instance = getStorage(getFirebaseClientApp());
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(instance) : val;
  },
});

export default getFirebaseClientApp;
