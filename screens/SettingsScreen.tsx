import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { AppSettings } from "../types/models";
import { defaultSettings, loadSettings, saveSettings } from "../services/storage";
import { SettingsField } from "../components/SettingsField";
import * as SMS from "expo-sms";
import * as Location from "expo-location";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

function validatePhone(num: string): string | undefined {
  const cleaned = num.replace(/\s+/g, "");
  if (!cleaned) return "Numer jest wymagany.";
  if (!/^\d+$/.test(cleaned)) return "Tylko cyfry (bez spacji i znaków).";
  if (cleaned.length < 3) return "Za krótki numer.";
  return undefined;
}

export function SettingsScreen({ navigation }: Props) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const canSave = useMemo(() => {
    const err = validatePhone(settings.emergencyNumber);
    setPhoneError(err);
    return !err;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.emergencyNumber]);

  async function onSave() {
    const err = validatePhone(settings.emergencyNumber);
    setPhoneError(err);
    if (err) {
      Alert.alert("Błąd", "Popraw numer alarmowy.");
      return;
    }
    await saveSettings({
      ...settings,
      emergencyNumber: settings.emergencyNumber.replace(/\s+/g, ""),
    });
    Alert.alert("Zapisano", "Ustawienia zapisane w pamięci urządzenia.");
    navigation.goBack();
  }

  async function testSms() {
    const ok = await SMS.isAvailableAsync();
    Alert.alert("SMS", ok ? "SMS jest wspierany na tym urządzeniu." : "SMS NIE jest wspierany na tym urządzeniu.");
  }

  async function testLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    Alert.alert("Lokalizacja", status === "granted" ? "Uprawnienia OK." : "Brak uprawnień do lokalizacji.");
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Settings</Text>

      <SettingsField
        label="Numer alarmowy / kontakt"
        value={settings.emergencyNumber}
        onChangeText={(t) => setSettings((s) => ({ ...s, emergencyNumber: t }))}
        placeholder="np. 112"
        keyboardType="numeric"
        error={phoneError}
      />

      <SettingsField
        label="Treść wiadomości SOS"
        value={settings.sosMessage}
        onChangeText={(t) => setSettings((s) => ({ ...s, sosMessage: t }))}
        placeholder="np. Potrzebuję pomocy. Jestem tutaj: {location}"
        multiline
      />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Dołącz lokalizację do SMS</Text>
          <Text style={styles.hint}>W treści użyj {"{location}"} jako placeholder.</Text>
        </View>
        <Switch
          value={settings.includeLocation}
          onValueChange={(v) => setSettings((s) => ({ ...s, includeLocation: v }))}
        />
      </View>

      <Text style={styles.sectionTitle}>Test natywnych funkcji</Text>
      <Text style={styles.testBtn} onPress={testSms}>• Sprawdź SMS</Text>
      <Text style={styles.testBtn} onPress={testLocation}>• Sprawdź lokalizację</Text>

      <Text style={[styles.saveBtn, !canSave && styles.disabled]} onPress={onSave}>
        Zapisz zmiany
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f3f4f6" },
  container: { padding: 16, paddingBottom: 28 },
  h1: { fontSize: 26, fontWeight: "800", color: "#111827", marginTop: 6 },
  row: {
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: { fontWeight: "800", color: "#111827" },
  hint: { marginTop: 4, color: "#6b7280", fontSize: 12 },
  sectionTitle: { marginTop: 20, fontSize: 16, fontWeight: "900", color: "#111827" },
  testBtn: { marginTop: 10, color: "#2563eb", fontWeight: "800" },
  saveBtn: {
    marginTop: 18,
    backgroundColor: "#111827",
    color: "white",
    textAlign: "center",
    paddingVertical: 14,
    borderRadius: 14,
    fontWeight: "900",
  },
  disabled: { opacity: 0.5 },
});
