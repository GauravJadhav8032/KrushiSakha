import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { OnboardingScreens } from "../constants/onboardingScreens";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const Onboarding = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // ❌ REMOVED: const { completeOnboarding } = useAuth();

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  // ✅ Handle completing onboarding
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");

      // ✅ Reset navigation stack so user can't go back to onboarding
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error saving onboarding state:", error);
      navigation.replace("Login");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* Decorative Top Circle */}
      <View style={styles.decorativeCircle} />

      {/* App Logo with Container */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/krushisakha_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <FlatList
        data={OnboardingScreens}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {OnboardingScreens.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Bottom Button - Only show on last screen */}
      {currentIndex === OnboardingScreens.length - 1 && (
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleGetStarted} // ✅ Using the new function
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#2E7D32", "#1B5E20"]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Skip Button - Show on all screens except last */}
      {currentIndex < OnboardingScreens.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleGetStarted}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  decorativeCircle: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#C8E6C9",
    opacity: 0.3,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: "#A5D6A7",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    color: "#1B5E20",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: "#558B2F",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 8,
    fontWeight: "400",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 28,
    backgroundColor: "#2E7D32",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#A5D6A7",
  },
  bottomButton: {
    position: "absolute",
    bottom: 50,
    left: 32,
    right: 32,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1B5E20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // ✅ NEW: Skip button styles
  skipButton: {
    position: "absolute",
    top: 50,
    right: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "600",
  },
});
