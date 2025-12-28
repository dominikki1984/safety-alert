import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  value: string;
  status?: "ok" | "warn";
  hint?: string;
};

export function InfoCard({ title, value, status = "ok", hint }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={[styles.status, status === "ok" ? styles.ok : styles.warn]}>
        {status === "ok" ? "● Aktywne" : "● Wymaga uwagi"}
      </Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    marginBottom: 8,
  },
  title: { fontSize: 14, fontWeight: "700", color: "#1f2937" },
  value: { marginTop: 4, fontSize: 15, color: "#111827" },
  status: { marginTop: 6, fontSize: 13, fontWeight: "600" },
  ok: { color: "#166534" },
  warn: { color: "#92400e" },
  hint: { marginTop: 6, fontSize: 12, color: "#6b7280" },
});
