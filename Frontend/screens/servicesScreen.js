import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import SearchBar from "../components/schemes/SearchBar";
import FilterChips from "../components/schemes/FilterChips";
import SchemeCard from "../components/schemes/SchemeCard";

import { fetchSchemes } from "../services/schemesService";
import { SCHEMES_SEED } from "../constants/schemesSeed";

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

const STATES = ["Maharashtra", "Punjab", "Gujarat", "Karnataka"];
const CATEGORIES = [
  "Crop Insurance",
  "Subsidy",
  "Irrigation",
  "Loans",
  "Equipment",
];

export default function ServicesScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all"); // all | central | state
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [error, setError] = useState("");

  const params = useMemo(() => {
    return {
      type: type === "all" ? "" : type,
      state: state ? state.toLowerCase() : "",
      category: category || "",
      q: query || "",
    };
  }, [type, state, category, query]);

  const loadSchemes = async ({ isRefresh = false } = {}) => {
    try {
      setError("");
      if (!isRefresh) setLoading(true);

      const list = await fetchSchemes(params);
      setSchemes(list);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSchemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.type, params.state, params.category]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSchemes({ isRefresh: true });
  };

  const onSearchSubmit = () => {
    // Only search when submit (keeps backend calls lower)
    loadSchemes();
  };

  const onOpenScheme = (scheme) => {
    navigation.navigate("SchemeDetails", { schemeId: scheme._id, scheme });
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
        <View>
          <Text style={styles.title}>Government Schemes</Text>
          <Text style={styles.subtitle}>
            Search and filter schemes relevant to you
          </Text>
        </View>
        <TouchableOpacity style={styles.infoBtn} activeOpacity={0.8}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={COLORS.primaryDark}
          />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.section}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={onSearchSubmit}
          onClear={() => {
            setQuery("");
            loadSchemes();
          }}
        />
      </View>

      {/* Filters */}
      <View style={styles.section}>
        <FilterChips
          typeValue={type}
          onTypeChange={(v) => {
            setType(v);
            // if type is central, state filter not required but still allowed; keeping it.
          }}
          stateValue={state}
          onStateChange={setState}
          categoryValue={category}
          onCategoryChange={setCategory}
          states={STATES}
          categories={CATEGORIES}
        />
      </View>

      {/* Results */}
      <View style={styles.listWrap}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading schemes...</Text>
          </View>
        ) : (
          <>
            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="warning-outline" size={18} color="#FB8C00" />
                <Text style={styles.errorText}>
                  {error}. Showing sample schemes for now.
                </Text>
              </View>
            )}

            <FlatList
              data={schemes}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <SchemeCard scheme={item} onPress={() => onOpenScheme(item)} />
              )}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.center}>
                  <Text style={styles.emptyTitle}>No schemes found</Text>
                  <Text style={styles.emptySub}>
                    Try changing filters or search keywords.
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primaryDark,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "500",
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bg3,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  section: { paddingHorizontal: 20, paddingTop: 10 },
  listWrap: { flex: 1, paddingTop: 10 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  center: { paddingHorizontal: 20, paddingTop: 50, alignItems: "center" },
  loadingText: { marginTop: 12, color: COLORS.muted, fontWeight: "600" },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  emptySub: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FFE0B2",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  errorText: { color: "#6D4C41", fontWeight: "600", flex: 1, fontSize: 12.5 },
});
