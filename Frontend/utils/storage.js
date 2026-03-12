import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../services/authService";

export const saveToken = async (token) => {
  await AsyncStorage.setItem("token", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  try {
    const token = await getToken();

    if (token) {
      await logoutUser(token);
    }
  } catch (error) {
    console.log("Logout API error:", error);
  } finally {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  }
};

export const isLoggedIn = async () => {
  const token = await getToken();
  return !!token;
};
