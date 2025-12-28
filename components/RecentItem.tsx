import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RecentAction } from "../types/models";

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString();
}

export function RecentItem({ item }: { item: RecentAction }) {
  const icon = item.type === "SMS" ? "💬" : item.type === "CALL" ? "📞" : "📷";

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.col}>
        <Text style={styles.title}>{item.title}</Text>
        {item.detail ? <Text style={styles.detail}>{item.detail}</Text> : null}
      </View>
      <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { fontSize: 18, marginRight: 10 },
  col: { flex: 1 },
  title: { fontWeight: "700", color: "#111827" },
  detail: { marginTop: 2, color: "#6b7280" },
  time: { marginLeft: 10, color: "#6b7280", fontSize: 12 },
});
