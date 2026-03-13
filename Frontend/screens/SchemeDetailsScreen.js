import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { fetchSchemeById } from "../services/schemesService";

const COLORS = {
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  bg1: "#E8F5E9",
  bg2: "#F1F8E9",
  bg3: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#757575",
  border: "#E8E8E8",
};

const TABS = ["Details", "Benefits", "Eligibility", "Documents", "Process"];

function ListSection({ items }) {
  if (!items?.length)
    return <Text style={styles.emptySmall}>Not available</Text>;
  return (
    <View style={{ gap: 10 }}>
      {items.map((x, idx) => (
        <View key={idx} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{x}</Text>
        </View>
      ))}
    </View>
  );
}

export default function SchemeDetailsScreen({ route, navigation }) {
  const schemeId = route?.params?.schemeId;
  const passedScheme = route?.params?.scheme;

  const [scheme, setScheme] = useState(passedScheme || null);
  const [tab, setTab] = useState("Details");
  const [loading, setLoading] = useState(!passedScheme);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!schemeId) return;
      if (passedScheme) return;

      try {
        setError("");
        setLoading(true);
        const s = await fetchSchemeById(schemeId);
        setScheme(s);
      } catch (e) {
        setError(e.message || "Failed to load scheme");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [schemeId, passedScheme]);

  const tags = useMemo(() => scheme?.tags || [], [scheme]);

  const openApply = async () => {
    if (!scheme?.applyLink) return;
    const can = await Linking.canOpenURL(scheme.applyLink);
    if (can) Linking.openURL(scheme.applyLink);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.bg1, COLORS.bg2, COLORS.bg3]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.35 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Scheme Details
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : !scheme ? (
        <View style={styles.center}>
          <Text style={styles.errTitle}>Unable to load scheme</Text>
          <Text style={styles.errSub}>{error || "Try again later."}</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.name}>{scheme.name}</Text>
              <Text style={styles.desc}>{scheme.description}</Text>

              <View style={styles.tagRow}>
                <View style={styles.typeChip}>
                  <Text style={styles.typeText}>
                    {scheme.type === "central" ? "Central" : "State"}
                  </Text>
                </View>
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

              {!!tags?.length && (
                <View style={styles.tagsWrap}>
                  {tags.map((t) => (
                    <View key={t} style={styles.tagChip}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.eligBtn} activeOpacity={0.85}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={COLORS.primaryDark}
                />
                <Text style={styles.eligText}>Check Eligibility</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsRow}
            >
              {TABS.map((t) => {
                const active = tab === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTab(t)}
                    style={[styles.tabChip, active && styles.tabChipActive]}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[styles.tabText, active && styles.tabTextActive]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.detailCard}>
              {tab === "Details" && (
                <Text style={styles.detailText}>
                  {scheme.description || "Not available"}
                </Text>
              )}
              {tab === "Benefits" && <ListSection items={scheme.benefits} />}
              {tab === "Eligibility" && (
                <ListSection items={scheme.eligibility} />
              )}
              {tab === "Documents" && <ListSection items={scheme.documents} />}
              {tab === "Process" && (
                <ListSection items={scheme.applicationProcess} />
              )}
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.applyBtn, !scheme.applyLink && { opacity: 0.5 }]}
              onPress={openApply}
              disabled={!scheme.applyLink}
              activeOpacity={0.85}
            >
              <Text style={styles.applyText}>Apply Now</Text>
              <Ionicons name="open-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primaryDark,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: { marginTop: 10, color: COLORS.muted, fontWeight: "600" },
  errTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  errSub: { marginTop: 6, color: COLORS.muted, textAlign: "center" },

  content: { paddingHorizontal: 16, paddingBottom: 110 },
  card: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
  },
  name: { fontSize: 18, fontWeight: "900", color: COLORS.primaryDark },
  desc: { marginTop: 8, fontSize: 13.5, color: COLORS.muted, lineHeight: 20 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  typeChip: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  typeText: { color: COLORS.primaryDark, fontWeight: "800", fontSize: 12 },
  metaChip: {
    backgroundColor: "#F6F7F6",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  metaText: { color: "#4A4A4A", fontWeight: "700", fontSize: 12 },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  tagChip: {
    backgroundColor: "#F1F8E9",
    borderWidth: 1,
    borderColor: "#DFF0E2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: COLORS.primaryDark, fontWeight: "700", fontSize: 12 },

  eligBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#DFF0E2",
    backgroundColor: "#F8FAF8",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  eligText: { color: COLORS.primaryDark, fontWeight: "800" },

  tabsRow: { paddingVertical: 12, gap: 10 },
  tabChip: {
    backgroundColor: "#F6F7F6",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  tabChipActive: { backgroundColor: "#E8F5E9", borderColor: "#BFE3C1" },
  tabText: { color: COLORS.muted, fontWeight: "800", fontSize: 13 },
  tabTextActive: { color: COLORS.primaryDark },

  detailCard: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
  },
  detailText: { color: COLORS.text, lineHeight: 20, fontSize: 14 },

  bulletRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
    marginTop: 7,
  },
  bulletText: { flex: 1, color: COLORS.text, lineHeight: 20, fontSize: 14 },
  emptySmall: { color: COLORS.muted },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  applyText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
});
