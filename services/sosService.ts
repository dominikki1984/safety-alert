import * as SMS from "expo-sms";
import { AppSettings } from "../types/models";
import { getLocationText } from "./locationService";

export type SosResult =
  | { ok: true; finalMessage: string }
  | { ok: false; message: string };

export async function sendSosSms(settings: AppSettings): Promise<SosResult> {
  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) {
    return { ok: false, message: "Twoje urządzenie nie obsługuje wysyłania SMS." };
  }

  let locationText = "brak";
  if (settings.includeLocation) {
    const loc = await getLocationText();
    if (!loc.ok) {
      // nadal pozwalamy wysłać SMS, tylko bez lokalizacji
      locationText = "brak (odmowa/brak dostępu)";
    } else {
      locationText = loc.coordsText;
    }
  }

  const finalMessage = settings.sosMessage.replace("{location}", locationText);

  try {
    const res = await SMS.sendSMSAsync([settings.emergencyNumber], finalMessage);
    if (res.result === "sent" || res.result === "unknown") {
      return { ok: true, finalMessage };
    }
    return { ok: false, message: "SMS nie został wysłany (anulowano lub błąd)." };
  } catch {
    return { ok: false, message: "Wystąpił błąd podczas wysyłania SMS." };
  }
}
