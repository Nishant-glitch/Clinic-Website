import "server-only";
import { getAppointmentsCollection, getContactMessagesCollection } from "@/lib/firebase/collections";

export interface DashboardStatsResult {
  newToday: number;
  pendingCallbacks: number;
  confirmedThisWeek: number;
  unreadMessages: number;
  dailyRequests: Array<{
    date: string;
    label: string;
    count: number;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStatsResult> {
  const appointmentsSnapshot = await getAppointmentsCollection()
    .orderBy("createdAt", "desc")
    .get();
  const messagesSnapshot = await getContactMessagesCollection().get();

  const appointments = appointmentsSnapshot.docs.map((d) => d.data());
  const messages = messagesSnapshot.docs.map((d) => d.data());

  // Today in Asia/Kolkata format YYYY-MM-DD
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayStr = formatter.format(now);

  // 1. Pending callbacks: status = new
  const pendingCallbacks = appointments.filter((a) => a.status === "new").length;

  // 2. New requests today
  const newToday = appointments.filter((a) => {
    if (!a.createdAt) return false;
    const dateObj = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt as unknown as string);
    const dateStr = formatter.format(dateObj);
    return dateStr === todayStr;
  }).length;

  // 3. Confirmed this week (last 7 days)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const confirmedThisWeek = appointments.filter((a) => {
    if (a.status !== "confirmed") return false;
    const dateObj = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
    return dateObj >= sevenDaysAgo;
  }).length;

  // 4. Unread messages
  const unreadMessages = messages.filter((m) => !m.read).length;

  // 5. Daily requests over last 14 days
  const dailyRequests: Array<{ date: string; label: string; count: number }> = [];
  const labelFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
  });

  for (let i = 13; i >= 0; i--) {
    const targetDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = formatter.format(targetDate);
    const label = labelFormatter.format(targetDate);

    const count = appointments.filter((a) => {
      if (!a.createdAt) return false;
      const dateObj = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt as unknown as string);
      return formatter.format(dateObj) === dateStr;
    }).length;

    dailyRequests.push({
      date: dateStr,
      label,
      count,
    });
  }

  return {
    newToday,
    pendingCallbacks,
    confirmedThisWeek,
    unreadMessages,
    dailyRequests,
  };
}
