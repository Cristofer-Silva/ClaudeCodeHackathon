export function timeRemaining(expiresAt: string): string {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const diff = expiry - now;

  if (diff <= 0) return 'Expired';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m left` : `${hours}h left`;
  }

  return `${minutes}m left`;
}

export function expiryProgress(createdAt: string, expiresAt: string): number {
  const now = new Date().getTime();
  const created = new Date(createdAt).getTime();
  const expiry = new Date(expiresAt).getTime();
  const total = expiry - created;
  const elapsed = now - created;

  return Math.max(0, Math.min(1, 1 - elapsed / total));
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
