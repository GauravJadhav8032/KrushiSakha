import { View, Text } from "react-native";
import React from "react";

const CommunityScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center", // centers content vertically in the container
        alignItems: "center", // centers content horizontally in the container
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 20, // Optional: styling for the text
          textAlign: "center",
        }}
      >
        CommunityScreen
      </Text>
    </View>
  );
};

export default CommunityScreen;
