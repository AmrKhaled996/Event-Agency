/** ─── Mock data factories ─── */

export function mockUsers(page = 1, limit = 8) {
  const statuses = ["active", "inactive", "banned"];
  const data = Array.from({ length: limit }, (_, i) => {
    const n = (page - 1) * limit + i + 1;
    return {
      id: `usr_${String(n).padStart(4, "0")}`,
      name: `User ${n}`,
      email: `user${n}@mail.com`,
      status: statuses[n % statuses.length],
      joined: `2024-${String((n % 12) + 1).padStart(2, "0")}-${String((n % 28) + 1).padStart(2, "0")}`,
    };
  });
  return { data, total: 120, limit };
}

export function mockOrganizers(page = 1, limit = 8) {
  const statuses = ["approved", "pending", "suspended"];
  const data = Array.from({ length: limit }, (_, i) => {
    const n = (page - 1) * limit + i + 1;
    return {
      id: `org_${String(n).padStart(4, "0")}`,
      name: `Organizer ${n}`,
      email: `org${n}@events.com`,
      events: n * 3,
      status: statuses[n % statuses.length],
    };
  });
  return { data, total: 48, limit };
}

export function mockEvents(page = 1, limit = 8) {
  const statuses = ["published", "draft", "cancelled"];
  const data = Array.from({ length: limit }, (_, i) => {
    const n = (page - 1) * limit + i + 1;
    return {
      id: `evt_${String(n).padStart(4, "0")}`,
      title: `Event ${n}`,
      organizer: `org_${String(n).padStart(4, "0")}`,
      date: `2025-${String((n % 12) + 1).padStart(2, "0")}-${String((n % 28) + 1).padStart(2, "0")}`,
      tickets: n * 12,
      status: statuses[n % statuses.length],
    };
  });
  return { data, total: 80, limit };
}
