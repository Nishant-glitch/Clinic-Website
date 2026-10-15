import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getUsersCollection } from "@/lib/firebase/collections";
import type { ServerAppUser, Role } from "@/lib/types";

export async function listUsers(): Promise<ServerAppUser[]> {
  const collection = getUsersCollection();
  const snapshot = await collection.orderBy("createdAt", "desc").get();
  return snapshot.docs.map((d) => d.data());
}

export async function getUserById(uid: string): Promise<ServerAppUser | null> {
  const doc = await getUsersCollection().doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() ?? null;
}

export async function updateUserRole(uid: string, role: Role): Promise<void> {
  await getUsersCollection().doc(uid).update({ role });
}

export async function disableUser(uid: string, disabled: boolean): Promise<void> {
  await getUsersCollection()
    .doc(uid)
    .update({ status: disabled ? "disabled" : "active" });
}

export async function createUserRecord(
  user: Omit<ServerAppUser, "createdAt">
): Promise<ServerAppUser> {
  const docRef = getUsersCollection().doc(user.uid);
  const record = {
    ...user,
    createdAt: FieldValue.serverTimestamp(),
  };
  await docRef.set(record as unknown as ServerAppUser);
  return {
    ...user,
    createdAt: Timestamp.now(),
  };
}
