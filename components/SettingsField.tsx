import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
};

export function SettingsField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline,
  keyboardType = "default",
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, multiline && styles.multiline, error && styles.inputError]}
        multiline={multiline}
        keyboardType={keyboardType}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 14 },
  label: { fontWeight: "700", color: "#111827", marginBottom: 6 },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  inputError: { borderColor: "#ef4444" },
  error: { marginTop: 6, color: "#b91c1c", fontSize: 12 },
});
