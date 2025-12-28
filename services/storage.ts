import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, RecentAction } from "../types/models";

const SETTINGS_KEY = "sa_settings_v1";
const RECENTS_KEY = "sa_recents_v1";

export const defaultSettings: AppSettings = {
  emergencyNumber: "112",
  sosMessage: "Potrzebuję pomocy. Jestem tutaj: {location}",
  includeLocation: true,
};

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadRecents(): Promise<RecentAction[]> {
  const raw = await AsyncStorage.getItem(RECENTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RecentAction[];
  } catch {
    return [];
  }
}

export async function addRecent(action: RecentAction): Promise<void> {
  const current = await loadRecents();
  const next = [action, ...current].slice(0, 10);
  await AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(next));
}

export async function clearRecents(): Promise<void> {
  await AsyncStorage.removeItem(RECENTS_KEY);
}
