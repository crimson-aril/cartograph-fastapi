export function startUrl(repository?: string): string {
  return repository ? `/start?repository=${encodeURIComponent(repository)}` : "/start";
}

export function workspaceUrl(repository?: string): string {
  return repository ? `/workspace?repository=${encodeURIComponent(repository)}` : "/workspace";
}
