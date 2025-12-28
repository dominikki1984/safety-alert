import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  subtitle?: string;
  emoji?: string;
  variant?: "danger" | "primary" | "success";
  onPress: () => void;
};

export function PrimaryActionButton({
  label,
  subtitle,
  emoji = "⚡",
  variant = "primary",
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed]}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textCol}>
          <Text style={styles.label}>{label}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginVertical: 8,
  },
  pressed: { opacity: 0.85 },
  danger: { backgroundColor: "#D64545" },
  primary: { backgroundColor: "#2E6DD8" },
  success: { backgroundColor: "#2F9E44" },
  row: { flexDirection: "row", alignItems: "center" },
  emoji: { fontSize: 22, marginRight: 12 },
  textCol: { flex: 1 },
  label: { color: "white", fontSize: 16, fontWeight: "700" },
  subtitle: { color: "white", opacity: 0.9, marginTop: 2 },
  chevron: { color: "white", fontSize: 28, marginLeft: 10, opacity: 0.9 },
});
