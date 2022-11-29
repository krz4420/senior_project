import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { calculateTimeDifference } from "../utils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Comment = ({ author, time, body }) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <MaterialCommunityIcons
          style={styles.avatar}
          name={"account"}
          size={35}
        />
        <Text style={{ flexDirection: "row", flexWrap: "wrap", width: "90%" }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>{author} </Text>
          <Text style={{ fontSize: 14 }}>{body}</Text>
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: "#666" }}>
        {calculateTimeDifference(time)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 30,
  },
  container: {
    backgroundColor: "#F9FBFC",
    width: "100%",
    padding: 5,
    borderColor: "#F9FBFC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 2,
  },
});

export default Comment;
