import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const COLORS = {
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  bg: "#FFFFFF",
  border: "#E8E8E8",
  text: "#1A1A1A",
  muted: "#757575",
  chipBg: "#E8F5E9",
};

export default function SchemeCard({ scheme, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>
          {scheme.name}
        </Text>

        <View
          style={[
            styles.chip,
            scheme.type === "central" ? styles.central : styles.state,
          ]}
        >
          <Text style={styles.chipText}>
            {scheme.type === "central" ? "Central" : "State"}
          </Text>
        </View>
      </View>

      <Text style={styles.desc} numberOfLines={2}>
        {scheme.description}
      </Text>

      <View style={styles.metaRow}>
        {!!scheme.category && (
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>{scheme.category}</Text>
          </View>
        )}
        {!!scheme.state && (
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>{scheme.state}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15.5,
    fontWeight: "800",
    lineHeight: 20,
  },
  desc: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.chipBg,
  },
  chipText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },
  central: {},
  state: {},
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
  metaChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F6F7F6",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  metaText: {
    fontSize: 12,
    color: "#4A4A4A",
    fontWeight: "600",
  },
});
