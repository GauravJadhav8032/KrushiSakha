import { useAuth } from "../App";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { logout, getUser, getToken, saveUser } from "../utils/storage";
import { updateUserProfile } from "../services/authService";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { signOut } = useAuth();

  // Editable fields
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    village: "",
    district: "",
    state: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
      if (userData) {
        setEditData({
          firstname: userData.fullname?.firstname || "",
          lastname: userData.fullname?.lastname || "",
          phone: userData.phone || "",
          village: userData.location?.village || "",
          district: userData.location?.district || "",
          state: userData.location?.state || "",
        });
      }
    } catch (error) {
      console.log("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editData.firstname.trim()) {
      Alert.alert("Error", "First name is required");
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();
      const profileData = {
        fullname: {
          firstname: editData.firstname.trim(),
          lastname: editData.lastname.trim(),
        },
        phone: editData.phone.trim(),
        location: {
          village: editData.village.trim(),
          district: editData.district.trim(),
          state: editData.state.trim(),
        },
      };

      const response = await updateUserProfile(token, profileData);

      // Update local storage with new user data
      await saveUser(response.user);
      setUser(response.user);

      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            // Call backend logout API
            const token = await getToken();
            if (token) {
              await logoutUser(token);
            }
          } catch (error) {
            console.log("Logout API error:", error);
          }

          // ✅ Use context signOut - this will automatically redirect to Login
          await signOut();

          // No need to navigate - AppNavigator handles it automatically!
        },
        style: "destructive",
      },
    ]);
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user?.fullname) return "U";
    const first = user.fullname.firstname?.[0] || "";
    const last = user.fullname.lastname?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  // Get full name
  const getFullName = () => {
    if (!user?.fullname) return "User";
    return (
      `${user.fullname.firstname || ""} ${user.fullname.lastname || ""}`.trim() ||
      "User"
    );
  };

  // Get location string
  const getLocationString = () => {
    if (!user?.location) return "Not set";
    const { village, district, state } = user.location;
    const parts = [village, district, state].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not set";
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
          style={StyleSheet.absoluteFillObject}
        />
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#E8F5E9", "#C8E6C9", "#FFFFFF"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.4 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity
            style={styles.editHeaderButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Ionicons name="create-outline" size={22} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#43A047", "#2E7D32", "#1B5E20"]}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </LinearGradient>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() =>
                Alert.alert("Coming Soon", "Photo upload feature coming soon!")
              }
            >
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{getFullName()}</Text>
          <Text style={styles.email}>{user?.email || "email@example.com"}</Text>

          {/* Member Since Badge */}
          <View style={styles.memberBadge}>
            <Ionicons name="leaf" size={14} color="#43A047" />
            <Text style={styles.memberText}>KrushiSakha Member</Text>
          </View>
        </View>

        {/* Contact Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(true)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <InfoItem
            icon="call"
            label="Phone Number"
            value={user?.phone || "Not set"}
            isEmpty={!user?.phone}
          />

          <InfoItem
            icon="location"
            label="Location"
            value={getLocationString()}
            isEmpty={getLocationString() === "Not set"}
          />

          <InfoItem
            icon="mail"
            label="Email"
            value={user?.email || "Not set"}
            isEmpty={!user?.email}
          />
        </View>

        {/* Quick Actions Card */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setEditModalVisible(true)}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="person-outline" size={20} color="#2E7D32" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Edit Profile</Text>
              <Text style={styles.actionSubtitle}>
                Update your personal information
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A5D6A7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Coming Soon", "Notification settings coming soon!")
            }
          >
            <View style={styles.actionIconContainer}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#2E7D32"
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Notifications</Text>
              <Text style={styles.actionSubtitle}>Manage your alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A5D6A7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Coming Soon", "Help & Support coming soon!")
            }
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="help-circle-outline" size={20} color="#2E7D32" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Help & Support</Text>
              <Text style={styles.actionSubtitle}>Get assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A5D6A7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert(
                "KrushiSakha",
                "Version 1.0.0\n\nYour farming companion app for smarter agriculture.\n\n© 2024 KrushiSakha Team",
              )
            }
          >
            <View style={styles.actionIconContainer}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#2E7D32"
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>About App</Text>
              <Text style={styles.actionSubtitle}>Version 1.0.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A5D6A7" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Made with 💚 for Farmers</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#757575" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Personal Info Section */}
              <Text style={styles.modalSectionTitle}>Personal Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={editData.firstname}
                  onChangeText={(text) =>
                    setEditData({ ...editData, firstname: text })
                  }
                  placeholder="Enter first name"
                  placeholderTextColor="#A5D6A7"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={editData.lastname}
                  onChangeText={(text) =>
                    setEditData({ ...editData, lastname: text })
                  }
                  placeholder="Enter last name"
                  placeholderTextColor="#A5D6A7"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editData.phone}
                  onChangeText={(text) =>
                    setEditData({ ...editData, phone: text })
                  }
                  placeholder="Enter phone number"
                  placeholderTextColor="#A5D6A7"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Location Section */}
              <Text style={styles.modalSectionTitle}>Location</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Village/Town</Text>
                <TextInput
                  style={styles.input}
                  value={editData.village}
                  onChangeText={(text) =>
                    setEditData({ ...editData, village: text })
                  }
                  placeholder="Enter village or town"
                  placeholderTextColor="#A5D6A7"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>District</Text>
                <TextInput
                  style={styles.input}
                  value={editData.district}
                  onChangeText={(text) =>
                    setEditData({ ...editData, district: text })
                  }
                  placeholder="Enter district"
                  placeholderTextColor="#A5D6A7"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  value={editData.state}
                  onChangeText={(text) =>
                    setEditData({ ...editData, state: text })
                  }
                  placeholder="Enter state"
                  placeholderTextColor="#A5D6A7"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={saving}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#43A047", "#2E7D32"]}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* Info Item Component */
function InfoItem({ icon, label, value, isEmpty }) {
  return (
    <View style={styles.infoItem}>
      <View style={[styles.infoIcon, isEmpty && styles.infoIconEmpty]}>
        <Ionicons
          name={icon}
          size={18}
          color={isEmpty ? "#BDBDBD" : "#2E7D32"}
        />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, isEmpty && styles.infoValueEmpty]}>
          {value}
        </Text>
      </View>
      {isEmpty && (
        <View style={styles.addBadge}>
          <Text style={styles.addBadgeText}>Add</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "500",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1B5E20",
    letterSpacing: 0.3,
  },
  editHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#1B5E20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  cameraButton: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#43A047",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  email: {
    fontSize: 14,
    color: "#66BB6A",
    marginBottom: 12,
    fontWeight: "500",
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  memberText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#1B5E20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B5E20",
    letterSpacing: 0.2,
  },
  editLink: {
    fontSize: 14,
    color: "#43A047",
    fontWeight: "600",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F8E9",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoIconEmpty: {
    backgroundColor: "#F5F5F5",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9E9E9E",
    marginBottom: 2,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: "#1B5E20",
    fontWeight: "600",
  },
  infoValueEmpty: {
    color: "#BDBDBD",
    fontStyle: "italic",
  },
  addBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addBadgeText: {
    fontSize: 11,
    color: "#F57C00",
    fontWeight: "700",
  },
  actionsCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#1B5E20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F8E9",
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    color: "#1B5E20",
    fontWeight: "600",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#9E9E9E",
    fontWeight: "400",
  },
  logoutButton: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#FFCDD2",
    gap: 10,
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  version: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
    color: "#A5D6A7",
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5E9",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B5E20",
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#66BB6A",
    marginTop: 20,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F1F8E9",
    borderWidth: 1.5,
    borderColor: "#C8E6C9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1B5E20",
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "600",
  },
});
