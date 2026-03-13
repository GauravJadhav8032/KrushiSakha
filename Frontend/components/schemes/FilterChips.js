import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const COLORS = {
  primary: "#2E7D32",
  bg: "#FFFFFF",
  chipBg: "#F6F7F6",
  chipActiveBg: "#E8F5E9",
  border: "#E8E8E8",
  text: "#1A1A1A",
  muted: "#757575",
};

export default function FilterChips({
  typeValue,
  onTypeChange,
  stateValue,
  onStateChange,
  categoryValue,
  onCategoryChange,
  states = [],
  categories = [],
}) {
  const types = [
    { key: "all", label: "All" },
    { key: "central", label: "Central" },
    { key: "state", label: "State" },
  ];

  const chip = (active) => [styles.chip, active && styles.chipActive];
  const chipText = (active) => [
    styles.chipText,
    active && styles.chipTextActive,
  ];

  return (
    <View style={{ gap: 10 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {types.map((t) => {
          const active = typeValue === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              onPress={() => onTypeChange(t.key)}
              style={chip(active)}
              activeOpacity={0.85}
            >
              <Text style={chipText(active)}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <TouchableOpacity
          onPress={() => onStateChange("")}
          style={chip(!stateValue)}
          activeOpacity={0.85}
        >
          <Text style={chipText(!stateValue)}>All States</Text>
        </TouchableOpacity>
        {states.map((s) => {
          const active = stateValue === s;
          return (
            <TouchableOpacity
              key={s}
              onPress={() => onStateChange(s)}
              style={chip(active)}
              activeOpacity={0.85}
            >
              <Text style={chipText(active)}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <TouchableOpacity
          onPress={() => onCategoryChange("")}
          style={chip(!categoryValue)}
          activeOpacity={0.85}
        >
          <Text style={chipText(!categoryValue)}>All Categories</Text>
        </TouchableOpacity>
        {categories.map((c) => {
          const active = categoryValue === c;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => onCategoryChange(c)}
              style={chip(active)}
              activeOpacity={0.85}
            >
              <Text style={chipText(active)}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 10, paddingVertical: 2 },
  chip: {
    backgroundColor: COLORS.chipBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: COLORS.chipActiveBg,
    borderColor: "#BFE3C1",
  },
  chipText: {
    color: COLORS.muted,
    fontWeight: "700",
    fontSize: 13,
  },
  chipTextActive: {
    color: COLORS.primary,
  },
});
