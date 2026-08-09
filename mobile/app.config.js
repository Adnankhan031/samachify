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
 *
 * Plain JS rather than TypeScript on purpose: eas-cli bundles its own config
 * parser, which fails to transpile .ts config files against this project's
 * TypeScript version.
 */
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...(config.android && config.android.config),
      googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY },
    },
  },
  ios: {
    ...config.ios,
    config: {
      ...(config.ios && config.ios.config),
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
});
