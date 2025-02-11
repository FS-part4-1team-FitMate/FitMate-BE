export function getTodayRange(now: Date): { startOfDay: Date; endOfDay: Date } {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0); // 오늘 00:00:00

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999); // 오늘 23:59:59

  return { startOfDay, endOfDay };
}
