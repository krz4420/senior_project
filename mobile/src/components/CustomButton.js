import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";

const CustomButton = ({
  onPress,
  text,
  type = "PRIMARY",
  bgColor,
  fgColor,
  disabled,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? { backgroundColor: bgColor } : {},
        disabled ? { backgroundColor: "#EBEBE4" } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? { color: fgColor } : {},
          disabled ? { color: "#C6C6C6" } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  container_PRIMARY: {
    backgroundColor: "#3B71F3",
  },
  container_TERTIARY: {},
  container_SECONDARY: {
    borderColor: "#3B71F3",
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: "red",
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
  text_TERTIARY: {
    color: "gray",
  },
  text_SECONDARY: {
    color: "#3B71F3",
  },
});

export default CustomButton;
