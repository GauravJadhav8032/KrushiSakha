import React, { useEffect, useState, createContext, useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

// Imported screens
import Onboarding from "./components/onboarding";
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import HomeScreen from "./screens/homeScreen";
import ServicesScreen from "./screens/servicesScreen";

const Stack = createNativeStackNavigator();

// ✅ Create Auth Context
export const AuthContext = createContext();

// ✅ Auth Provider Component
export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const onboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      setUserToken(token);
      setHasSeenOnboarding(onboarding === "true");
    } catch (error) {
      console.log("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token, user) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUserToken(token);
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUserToken(null);
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      setHasSeenOnboarding(true);
    } catch (error) {
      console.log("Error completing onboarding:", error);
    }
  };

  const authContext = {
    isLoading,
    userToken,
    hasSeenOnboarding,
    signIn,
    signOut,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

// ✅ Custom hook to use auth
export const useAuth = () => useContext(AuthContext);

// ✅ Main App Component
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

// ✅ Navigator Component
function AppNavigator() {
  const { isLoading, userToken, hasSeenOnboarding } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#E8F5E9", "#C8E6C9", "#FFFFFF"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          // ✅ AUTHENTICATED SCREENS - Only for logged in users
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Services" component={ServicesScreen} />
          </>
        ) : (
          // ✅ UNAUTHENTICATED SCREENS - For guests
          <>
            {!hasSeenOnboarding && (
              <Stack.Screen name="Onboarding" component={Onboarding} />
            )}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
  },
});
