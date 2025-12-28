import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { InfoCard } from "../components/InfoCard";
import { PrimaryActionButton } from "../components/PrimaryActionButton";
import { RecentItem } from "../components/RecentItem";

import {
  addRecent,
  loadRecents,
  loadSettings,
  clearRecents,
} from "../services/storage";

import { RecentAction } from "../types/models";
import { getLocationText } from "../services/locationService";
import { sendSosSms } from "../services/sosService";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const [locationLine, setLocationLine] = useState<string>("Pobieranie…");
  const [gpsOk, setGpsOk] = useState<boolean>(true);
  const [recents, setRecents] = useState<RecentAction[]>([]);

  /* -------------------- helpers -------------------- */

  const refreshRecents = useCallback(async () => {
    const items = await loadRecents();
    setRecents(items);
  }, []);

  const refreshLocation = useCallback(async () => {
    const res = await getLocationText();
    if (!res.ok) {
      setGpsOk(false);
      setLocationLine("Brak dostępu do lokalizacji");
      return;
    }
    setGpsOk(true);
    setLocationLine(res.coordsText);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refreshRecents();
      refreshLocation();
    });
    return unsubscribe;
  }, [navigation, refreshRecents, refreshLocation]);

  /* -------------------- actions -------------------- */

  async function onSendSos() {
    const settings = await loadSettings();

    if (!settings.emergencyNumber.trim()) {
      Alert.alert("Brak numeru", "Ustaw numer alarmowy w Settings.");
      return;
    }

    const res = await sendSosSms(settings);
    if (!res.ok) {
      Alert.alert("Nie udało się wysłać SMS", res.message);
      return;
    }

    await addRecent({
      id: String(Date.now()),
      type: "SMS",
      timestamp: Date.now(),
      title: "Wysłano SOS SMS",
      detail: `Do: ${settings.emergencyNumber}`,
    });

    await refreshRecents();
    Alert.alert("SOS", "SMS został wysłany.");
  }

  async function onCallEmergency() {
    const settings = await loadSettings();
    const number = settings.emergencyNumber.trim() || "112";
    const url = `tel:${number}`;

    try {
      await addRecent({
        id: String(Date.now()),
        type: "CALL",
        timestamp: Date.now(),
        title: "Otwarto dialer",
        detail: `Numer: ${number}`,
      });

      await refreshRecents();
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Nie można wykonać połączenia",
        Platform.OS === "android"
          ? "Na emulatorze Android dialer zwykle nie działa. Przetestuj na fizycznym telefonie."
          : "To urządzenie nie obsługuje połączeń telefonicznych."
      );
    }
  }


  function onOpenCamera() {
    navigation.navigate("Camera");
  }

  async function onClearRecents() {
    Alert.alert(
      "Wyczyścić historię?",
      "Ta operacja usunie wszystkie zapisane akcje.",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Wyczyść",
          style: "destructive",
          onPress: async () => {
            await clearRecents();
            setRecents([]);
          },
        },
      ]
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.h1}>Na Ratunek</Text>
        <Text style={styles.link} onPress={() => navigation.navigate("Settings")}>
          Ustawienia →
        </Text>
      </View>

      <InfoCard
        title="Twoja lokalizacja"
        value={locationLine}
        status={gpsOk ? "ok" : "warn"}
        hint={gpsOk ? "GPS działa" : "Nadaj uprawnienia w ustawieniach telefonu"}
      />

      <PrimaryActionButton
        label="Wyślij SOS SMS"
        subtitle="Wyśle wiadomość z lokalizacją (jeśli włączona)"
        emoji="🆘"
        variant="danger"
        onPress={onSendSos}
      />

      <PrimaryActionButton
        label="Zadzwoń na numer alarmowy"
        subtitle="Otworzy dialer z ustawionym numerem"
        emoji="📞"
        variant="primary"
        onPress={onCallEmergency}
      />

      <PrimaryActionButton
        label="Otwórz aparat"
        subtitle="Zrób zdjęcie i zapisz je"
        emoji="📷"
        variant="success"
        onPress={onOpenCamera}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ostatnie akcje</Text>
        {recents.length > 0 && (
          <Text style={styles.clear} onPress={onClearRecents}>
            Wyczyść
          </Text>
        )}
      </View>

      {recents.length === 0 ? (
        <Text style={styles.empty}>Brak historii — wykonaj akcję powyżej.</Text>
      ) : (
        recents.map((item) => <RecentItem key={item.id} item={item} />)
      )}
    </ScrollView>
  );
}

/* -------------------- styles -------------------- */

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f3f4f6" },
  container: { padding: 16, paddingBottom: 28 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },

  h1: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },

  link: {
    color: "#2563eb",
    fontWeight: "700",
  },

  sectionHeader: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  clear: {
    color: "#dc2626",
    fontWeight: "800",
  },

  empty: {
    marginTop: 8,
    color: "#6b7280",
  },
});
