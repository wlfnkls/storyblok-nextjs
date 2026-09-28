const SETTINGS_FOLDER = 'settings';

// Stories in the settings folder hold site config and are never rendered as pages
export function isSettingsSlug(slug: string) {
  const normalized = slug.replace(/^\/+|\/+$/g, '').toLowerCase();
  return (
    normalized === SETTINGS_FOLDER ||
    normalized.startsWith(`${SETTINGS_FOLDER}/`)
  );
}
