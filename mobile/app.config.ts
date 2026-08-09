import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Extends `app.json` with values that must not live in the repository.
 *
 * The Samachify GitHub repo is public, so the Google Maps key is injected from
 * the environment instead of being committed. Locally that comes from
 * `mobile/.env` (gitignored); on EAS it comes from an EAS secret of the same
 * name. An Android Maps key is readable in any shipped APK regardless, so it
 * must also be restricted in Google Cloud Console to this app's package name
 * and signing certificate — keeping it out of git prevents scraping, not
 * extraction.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? 'Samachify',
  slug: config.slug ?? 'samachify',
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY },
    },
  },
  ios: {
    ...config.ios,
    config: {
      ...config.ios?.config,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
});
