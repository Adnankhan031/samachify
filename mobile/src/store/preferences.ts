/**
 * Small on-device preferences. Nothing here is business data — it's the state that
 * decides whether a returning user sees onboarding again, and what they last looked
 * at. Kept out of Supabase deliberately: it's per-install, not per-account.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'samachify_onboarding_complete_v1';
const RECENT_KEY = 'samachify_recently_viewed_v1';
const MAX_RECENT = 6;

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
  } catch {
    // If storage is unreadable, showing onboarding once more is the kinder failure.
    return false;
  }
}

export async function completeOnboarding(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch {
    // Non-fatal: worst case the user sees onboarding again next launch.
  }
}

export async function getRecentlyViewed(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/** Most recent first, de-duplicated, capped. */
export async function pushRecentlyViewed(productId: string): Promise<void> {
  try {
    const current = await getRecentlyViewed();
    const next = [productId, ...current.filter((id) => id !== productId)].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Non-fatal.
  }
}
