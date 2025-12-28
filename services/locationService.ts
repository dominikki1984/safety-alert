import * as Location from "expo-location";

export type LocationResult =
  | { ok: true; coordsText: string }
  | { ok: false; message: string };

export async function getLocationText(): Promise<LocationResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return { ok: false, message: "Brak uprawnień do lokalizacji." };
  }

  try {
    const pos = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = pos.coords;
    const coordsText = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    return { ok: true, coordsText };
  } catch {
    return { ok: false, message: "Nie udało się pobrać lokalizacji." };
  }
}
