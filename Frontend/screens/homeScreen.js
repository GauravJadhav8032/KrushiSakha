import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Tab Screens
import AIChatScreen from "./AIChatScreen";
import CommunityScreen from "./communityScreen";
import ExpertScreen from "./expertScreen";
import ServicesScreen from "./servicesScreen";
import ProfileScreen from "./profileScreen";

const { width } = Dimensions.get("window");

function Dashboard({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={styles.container}>
        {/* Gradient Background */}
        <LinearGradient
          colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.3 }}
        />

        {/* Decorative Circle */}
        <View style={styles.decorativeCircle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/krushisakha_logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={styles.appName}>Krushi Sakha</Text>
                <Text style={styles.tagline}>Empowering Farmers</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications" size={24} color="#2E7D32" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcome}>Hello, Farmer! 👋</Text>
            <Text style={styles.subtitle}>
              What would you like to do today?
            </Text>
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.grid}>
            <ActionCard
              icon="leaf"
              label="Govt Schemes"
              color="#4CAF50"
              onPress={() => navigation.navigate("Services")}
            />
            <ActionCard
              icon="chatbubble-ellipses"
              label="AI Chat"
              color="#66BB6A"
              onPress={() => navigation.navigate("AIChat")}
            />
            <ActionCard
              icon="people"
              label="Expert Help"
              color="#81C784"
              onPress={() => navigation.navigate("Experts")}
            />
            <ActionCard
              icon="chatbox"
              label="Community"
              color="#A5D6A7"
              onPress={() => navigation.navigate("Community")}
            />
          </View>

          {/* Info Banner */}
          <TouchableOpacity style={styles.banner} activeOpacity={0.8}>
            <LinearGradient
              colors={["#C8E6C9", "#E8F5E9"]}
              style={styles.bannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.bannerIcon}>
                <Ionicons name="megaphone" size={24} color="#2E7D32" />
              </View>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>New Update!</Text>
                <Text style={styles.bannerText}>
                  Government subsidy available for crop insurance. Apply now!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#558B2F" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Featured Services */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredContainer}>
            <FeatureCard
              icon="sunny"
              title="Weather Forecast"
              description="7-day weather updates"
              color="#FFA726"
            />
            <FeatureCard
              icon="water"
              title="Crop Care Tips"
              description="Expert farming advice"
              color="#42A5F5"
            />
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("Experts")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#2E7D32", "#1B5E20"]}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="call" size={20} color="#FFFFFF" />
              <Text style={styles.ctaText}>Talk to an Expert Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* Action Card Component */
function ActionCard({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[styles.cardIconContainer, { backgroundColor: `${color}20` }]}
      >
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Feature Card Component */
function FeatureCard({ icon, title, description, color }) {
  return (
    <View style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#A5D6A7" />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#BDBDBD",
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E8F5E9",
          elevation: 8,
          shadowColor: "#2E7D32",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        // tabBarIcon: ({ color, size, focused }) => {
        //   let icon;

        //   if (route.name === "Home") icon = focused ? "home" : "home-outline";
        //   else if (route.name === "AIChat")
        //     icon = focused
        //       ? "chatbubble-ellipses"
        //       : "chatbubble-ellipses-outline";
        //   else if (route.name === "Community")
        //     icon = focused ? "people" : "people-outline";
        //   else if (route.name === "Experts")
        //     icon = focused ? "person" : "person-outline";
        //   else if (route.name === "Profile")
        //     icon = focused ? "person-circle" : "person-circle-outline";

        //   return (
        //     <View style={focused ? styles.activeTabIcon : null}>
        //       <Ionicons name={icon} size={24} color={color} />
        //     </View>
        //   );
        // },
        tabBarIcon: ({ color, focused }) => {
          let icon;

          if (route.name === "Home") icon = focused ? "home" : "home-outline";
          else if (route.name === "AIChat")
            icon = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          else if (route.name === "Community")
            icon = focused ? "people" : "people-outline";
          else if (route.name === "Experts")
            icon = focused ? "person" : "person-outline";
          else if (route.name === "Profile")
            icon = focused ? "person-circle" : "person-circle-outline";

          return (
            <View
              style={[styles.tabIconContainer, focused && styles.activeTabIcon]}
            >
              <Ionicons name={icon} size={24} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ title: "AI Chat" }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ title: "Community" }}
      />
      <Tab.Screen
        name="Experts"
        component={ExpertScreen}
        options={{ title: "Experts" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  decorativeCircle: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#C8E6C9",
    opacity: 0.3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 35,
    height: 35,
  },
  appName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1B5E20",
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 12,
    color: "#558B2F",
    fontWeight: "500",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D32F2F",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B5E20",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: "#558B2F",
    fontWeight: "400",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B5E20",
    letterSpacing: 0.3,
  },
  seeAll: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginBottom: 24,
    gap: 12,
  },
  card: {
    width: (width - 48) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E20",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  banner: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 13,
    color: "#558B2F",
    lineHeight: 18,
    fontWeight: "500",
  },
  featuredContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F8E9",
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: "#558B2F",
    fontWeight: "400",
  },
  ctaButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1B5E20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 12,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // activeTabIcon: {
  //   backgroundColor: "#E8F5E9",
  //   padding: 8,
  //   borderRadius: 12,
  // },
  tabIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  activeTabIcon: {
    // backgroundColor: "#E8F5E9",
    // borderRadius: 20,
  },
});
