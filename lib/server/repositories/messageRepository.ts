import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getContactMessagesCollection } from "@/lib/firebase/collections";
import type { ServerContactMessage } from "@/lib/types";

export interface MessageFilters {
  unreadOnly?: boolean;
  q?: string;
  cursor?: string;
  limit?: number;
}

export interface ListMessagesResult {
  messages: ServerContactMessage[];
  unreadCount: number;
  totalCount: number;
  nextCursor?: string;
}

export async function createMessage(
  data: Omit<ServerContactMessage, "id" | "createdAt">
): Promise<ServerContactMessage> {
  const collection = getContactMessagesCollection();
  const docRef = collection.doc();

  const record: Record<string, unknown> = {
    ...data,
    id: docRef.id,
    createdAt: FieldValue.serverTimestamp(),
  };

  for (const key of Object.keys(record)) {
    if (record[key] === undefined) {
      delete record[key];
    }
  }

  await docRef.set(record as unknown as ServerContactMessage);

  return {
    ...data,
    id: docRef.id,
    createdAt: Timestamp.now(),
  };
}

export async function getMessageById(
  id: string
): Promise<ServerContactMessage | null> {
  const doc = await getContactMessagesCollection().doc(id).get();
  if (!doc.exists) return null;
  return doc.data() ?? null;
}

export async function listMessages(
  filters: MessageFilters = {}
): Promise<ListMessagesResult> {
  const collection = getContactMessagesCollection();
  const limit = Math.min(filters.limit || 20, 100);

  const snapshot = await collection.orderBy("createdAt", "desc").get();
  const allDocs = snapshot.docs.map((d) => d.data());

  let unreadCount = 0;
  for (const doc of allDocs) {
    if (!doc.read) unreadCount++;
  }

  let filtered = allDocs;

  if (filters.unreadOnly) {
    filtered = filtered.filter((m) => !m.read);
  }

  if (filters.q) {
    const query = filters.q.toLowerCase().trim();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.phone.includes(query) ||
        (m.email && m.email.toLowerCase().includes(query)) ||
        m.message.toLowerCase().includes(query)
    );
  }

  const totalCount = filtered.length;

  let startIndex = 0;
  if (filters.cursor) {
    const cursorIndex = filtered.findIndex((m) => m.id === filters.cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  const pagedItems = filtered.slice(startIndex, startIndex + limit);
  const nextCursor =
    startIndex + limit < filtered.length ? pagedItems[pagedItems.length - 1]?.id : undefined;

  return {
    messages: pagedItems,
    unreadCount,
    totalCount,
    nextCursor,
  };
}

export async function updateMessage(
  id: string,
  patch: Partial<ServerContactMessage>
): Promise<void> {
  const docRef = getContactMessagesCollection().doc(id);
  const updateData: Record<string, unknown> = { ...patch };
  delete updateData.id;
  await docRef.update(updateData);
}

export async function deleteMessage(id: string): Promise<void> {
  await getContactMessagesCollection().doc(id).delete();
}
