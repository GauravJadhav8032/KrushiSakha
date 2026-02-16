import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

//imported screens
import Onboarding from "./components/onboarding";
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import HomeScreen from "./screens/homeScreen";
import ServicesScreen from "./screens/servicesScreen";
import { useSafeAreaFrame } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem("hasSeenOnboarding");
      if (value == "true") {
        setHasSeenOnboarding(true);
      }
      setIsLoading(false);
    };
    checkOnboarding();
  }, []);

  if (isLoading) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenOnboarding ? (
          <Stack.Screen name="Onboarding" component={Onboarding} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}

        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
