import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const COLORS = {
  // Greens
  green900: "#1b5e20",
  green700: "#2E7D32",
  green500: "#43a047",
  green100: "#d6f0dd",
  green50: "#f0faf2",

  // Earth / Warm
  earth50: "#fdf8f1",
  earth100: "#f5ede0",
  earth200: "#e8d5b7",
  earth400: "#b5875a",

  // Amber
  amber100: "#fef3d6",
  amber500: "#f59e0b",

  // Neutrals
  white: "#ffffff",
  bgPage: "#fdfaf6",
  text: "#1a1208",
  textMid: "#4a3f2e",
  textMuted: "#8a7a68",
  textLight: "#b5a898",
  border: "rgba(100,80,50,0.12)",
  borderSt: "rgba(100,80,50,0.22)",

  // Semantic tags
  tagWaterBg: "#e0f2fe",
  tagWaterTxt: "#0369a1",
  tagOrganicBg: "#d6f0dd",
  tagOrganicTxt: "#1b5e20",
  tagTechBg: "#f0e6ff",
  tagTechTxt: "#6d28d9",
  tagSolarBg: "#fef3d6",
  tagSolarTxt: "#92400e",
};

const FONTS = {
  serif: "Georgia", // closest to Playfair in RN without custom fonts
  sans: "System",
};

// ─── Static Data ─────────────────────────────────────────────────────────────
const FILTERS = [
  "All",
  "Irrigation",
  "Organic",
  "Technology",
  "Solar",
  "Livestock",
];

const TRENDING = [
  "#DroughtResistant",
  "#SoilHealth",
  "#KharifSeason",
  "#PMKisan",
  "#FPO",
];

const STATS = [
  { num: "2.4k", label: "Farmers" },
  { num: "186", label: "Posts today" },
  { num: "14", label: "States" },
];

const POSTS = [
  {
    id: "1",
    farmer: "Ramesh Patil",
    initials: "RP",
    avatarColor: "green",
    location: "Maharashtra",
    time: "2h ago",
    tag: "Irrigation",
    tagStyle: "water",
    title: "Drip irrigation helped me save 40% water",
    description:
      "Using drip irrigation saved 40% water and improved crop yield. The initial investment paid off in just one season. Happy to share supplier contacts with anyone interested!",
    image:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80",
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    farmer: "Gurpreet Singh",
    initials: "GS",
    avatarColor: "amber",
    location: "Punjab",
    time: "5h ago",
    tag: "Organic",
    tagStyle: "organic",
    title: "Organic fertilizers transformed my soil health",
    description:
      "Switched to organic fertilizers two seasons ago. Soil water retention improved 30% — no chemical inputs needed. This season's wheat yield broke my personal record.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
    likes: 40,
    comments: 15,
  },
  {
    id: "3",
    farmer: "Mahesh Gowda",
    initials: "MG",
    avatarColor: "earth",
    location: "Karnataka",
    time: "Yesterday",
    tag: "Technology",
    tagStyle: "tech",
    title: "Modern greenhouse doubled my vegetable yields",
    description:
      "Controlled temperature & humidity in my greenhouse has boosted vegetable production year-round — no pest issues and premium market prices every time.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
    likes: 31,
    comments: 6,
  },
  {
    id: "4",
    farmer: "Suresh Chauhan",
    initials: "SC",
    avatarColor: "green",
    location: "Gujarat",
    time: "2 days ago",
    tag: "Solar Energy",
    tagStyle: "solar",
    title: "Solar pumps cut my irrigation costs by 70%",
    description:
      "Installed a 3HP solar pump under PM-KUSUM scheme — 90% subsidy, zero electricity bills since. Best investment in 10 years of farming. DM for the application process.",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
    likes: 18,
    comments: 11,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avatarColors = {
  green: { bg: COLORS.green100, text: COLORS.green900 },
  amber: { bg: COLORS.amber100, text: "#92400e" },
  earth: { bg: COLORS.earth100, text: "#7c3d12" },
};

const tagStyles = {
  water: { bg: COLORS.tagWaterBg, text: COLORS.tagWaterTxt },
  organic: { bg: COLORS.tagOrganicBg, text: COLORS.tagOrganicTxt },
  tech: { bg: COLORS.tagTechBg, text: COLORS.tagTechTxt },
  solar: { bg: COLORS.tagSolarBg, text: COLORS.tagSolarTxt },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ initials, color }) {
  const c = avatarColors[color] || avatarColors.green;
  return (
    <View style={[styles.avatar, { backgroundColor: c.bg }]}>
      <Text style={[styles.avatarText, { color: c.text }]}>{initials}</Text>
    </View>
  );
}

function Tag({ label, style }) {
  const s = tagStyles[style] || tagStyles.organic;
  return (
    <View style={[styles.tag, { backgroundColor: s.bg }]}>
      <Text style={[styles.tagText, { color: s.text }]}>#{label}</Text>
    </View>
  );
}

function StatCard({ num, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNum}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LikeButton({ count, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [liked, setLiked] = useState(false);

  const handlePress = () => {
    const next = !liked;
    setLiked(next);
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.35,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    onPress(next);
  };

  return (
    <TouchableOpacity
      style={styles.actionBtn}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={19}
          color={liked ? "#dc2626" : COLORS.textMuted}
        />
      </Animated.View>
      <Text style={[styles.actionText, liked && { color: "#dc2626" }]}>
        {count}
      </Text>
    </TouchableOpacity>
  );
}

function PostCard({ item }) {
  const [likes, setLikes] = useState(item.likes);

  const handleLike = (isLiked) =>
    setLikes((prev) => (isLiked ? prev + 1 : prev - 1));

  return (
    <View style={styles.card}>
      {/* Farmer row */}
      <View style={styles.cardBody}>
        <View style={styles.farmerRow}>
          <View style={styles.farmerInfo}>
            <Avatar initials={item.initials} color={item.avatarColor} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.farmerName}>{item.farmer}</Text>
              <View style={styles.farmerMeta}>
                <Text style={styles.metaText}>{item.location}</Text>
                <View style={styles.dot} />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreBtn} activeOpacity={0.6}>
            <Ionicons
              name="ellipsis-horizontal"
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        <Tag label={item.tag} style={item.tagStyle} />

        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>

      {/* Image */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(10,20,5,0.32)"]}
          style={styles.imageOverlay}
        />
      </View>

      {/* Description */}
      <View style={styles.cardBody}>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        <LikeButton count={likes} onPress={handleLike} />
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={COLORS.textMuted}
          />
          <Text style={styles.actionText}>{item.comments} comments</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons
            name="share-social-outline"
            size={18}
            color={COLORS.textMuted}
          />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function CommunityScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchVisible, setSearchVisible] = useState(false);

  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Stats */}
      <View style={styles.statsRow}>
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </View>

      {/* Trending */}
      <View style={styles.trendingSection}>
        <Text style={styles.trendingLabel}>Trending</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.trendScroll}
        >
          {TRENDING.map((t) => (
            <TouchableOpacity
              key={t}
              style={styles.trendChip}
              activeOpacity={0.7}
            >
              <Text style={styles.trendChipText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgPage} />

      {/* Background */}
      <LinearGradient
        colors={[COLORS.earth50, COLORS.bgPage]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>KrushiSakha</Text>
          <Text style={styles.headerTitle}>Community</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setSearchVisible((v) => !v)}
            activeOpacity={0.7}
          >
            <Ionicons name="search-outline" size={19} color={COLORS.green700} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons
              name="notifications-outline"
              size={19}
              color={COLORS.green700}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.newPostBtn} activeOpacity={0.8}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.newPostBtnText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Search bar (conditional) ── */}
      {searchVisible && (
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={16}
            color={COLORS.textMuted}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search posts, farmers, topics..."
            placeholderTextColor={COLORS.textLight}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      )}

      {/* ── Feed ── */}
      <FlatList
        data={POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: "rgba(253,250,246,0.95)",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: COLORS.green700,
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.borderSt,
    alignItems: "center",
    justifyContent: "center",
  },
  newPostBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green700,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 4,
  },
  newPostBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  // ── Search ──
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: COLORS.borderSt,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  // ── Filters ──
  filterStrip: {
    flexGrow: 0,
    paddingVertical: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.borderSt,
    marginRight: 8,
    backgroundColor: "transparent",
  },
  filterChipActive: {
    height: 38,
    backgroundColor: COLORS.green700,
    borderColor: COLORS.green700,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.textMid,
  },
  filterChipTextActive: {
    color: "#fff",
    fontWeight: "500",
  },

  // ── Feed ──
  feedContent: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  listHeader: {
    paddingTop: 8,
    paddingBottom: 4,
    gap: 14,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    paddingVertical: 14,
    alignItems: "center",
  },
  statNum: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.green700,
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // ── Trending ──
  trendingSection: {
    gap: 8,
  },
  trendingLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.textMuted,
  },
  trendScroll: {
    flexGrow: 0,
  },
  trendChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.earth100,
    marginRight: 8,
  },
  trendChipText: {
    fontSize: 12.5,
    fontWeight: "500",
    color: COLORS.earth400,
  },

  // ── Featured banner ──
  featuredBanner: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 6,
  },
  featuredGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  featuredIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  featuredText: {
    flex: 1,
  },
  featuredEyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 3,
  },
  featuredTitle: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    lineHeight: 19,
  },

  // ── Post Card ──
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  // Farmer row
  farmerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  farmerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: "700",
  },
  farmerName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  farmerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11.5,
    color: COLORS.textMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textLight,
  },
  moreBtn: {
    padding: 4,
  },

  // Tag
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // Card title
  cardTitle: {
    fontFamily: FONTS.serif,
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 12,
  },

  // Image
  imageWrap: {
    width: "100%",
    height: 210,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  // Description
  cardDescription: {
    fontSize: 13.5,
    color: COLORS.textMid,
    lineHeight: 21,
    paddingBottom: 12,
  },

  // Divider
  divider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginHorizontal: 0,
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    gap: 5,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontWeight: "400",
  },
  actionDivider: {
    width: 0.5,
    height: 22,
    backgroundColor: COLORS.border,
  },
});
