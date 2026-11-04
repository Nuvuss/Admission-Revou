// Server-side In-Memory Online Presence Tracker
// Tracks active counselor sessions with auto-expiry (45 seconds)

interface OnlineUserRecord {
  userName: string;
  userRole: string;
  lastPing: number;
}

// Global declaration to survive hot-reloading in development
declare global {
  // eslint-disable-next-line no-var
  var __revouOnlineUsers: Map<string, OnlineUserRecord> | undefined;
}

if (!globalThis.__revouOnlineUsers) {
  globalThis.__revouOnlineUsers = new Map<string, OnlineUserRecord>();
}

const onlineUsersMap = globalThis.__revouOnlineUsers;

const EXPIRY_MS = 45 * 1000; // 45 seconds timeout

export function trackUserHeartbeat(userName: string, userRole = "AC") {
  if (!userName || !userName.trim()) return;
  const name = userName.trim();
  onlineUsersMap.set(name, {
    userName: name,
    userRole,
    lastPing: Date.now(),
  });
}

export function removeUserOnline(userName: string) {
  if (!userName || !userName.trim()) return;
  const name = userName.trim();
  onlineUsersMap.delete(name);
}

export function getOnlineUsers() {
  const now = Date.now();
  const activeList: OnlineUserRecord[] = [];

  for (const [name, record] of Array.from(onlineUsersMap.entries())) {
    if (now - record.lastPing > EXPIRY_MS) {
      onlineUsersMap.delete(name);
    } else {
      activeList.push(record);
    }
  }

  const count = activeList.length;
  const acBmCount = activeList.filter(
    (u) => u.userRole === "AC" || u.userRole === "BM"
  ).length;

  return {
    count,
    acBmCount,
    users: activeList.map((u) => ({
      userName: u.userName,
      userRole: u.userRole,
      lastPing: u.lastPing,
    })),
  };
}

