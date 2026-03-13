import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#2E7D32",
  bg: "#FFFFFF",
  border: "#E8E8E8",
  muted: "#757575",
};

export default function SearchBar({ value, onChangeText, onSubmit, onClear }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color={COLORS.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search schemes (e.g., insurance)"
        placeholderTextColor={COLORS.muted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {!!value && (
        <TouchableOpacity onPress={onClear} hitSlop={10}>
          <Ionicons name="close-circle" size={18} color={COLORS.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
    paddingVertical: 0,
  },
});
