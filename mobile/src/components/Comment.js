import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BACKENDPOINT } from "../utils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/Auth";

const Comment = ({ author, time, body }) => {
  const auth = useAuth();
  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const calculateTimeDifference = () => {
    const postedTime = new Date(time);
    const currTime = Date.now();
    const differenceMilliseconds = currTime - postedTime;
    const diffMinutes = Math.ceil(differenceMilliseconds / (1000 * 60));
    const diffHours = Math.ceil(differenceMilliseconds / (1000 * 3600));
    const diffDays = Math.ceil(diffHours / 24);

    if (diffMinutes <= 59) {
      return diffMinutes == 1
        ? `${diffMinutes} Minute ago`
        : `${diffMinutes} Minutes ago`;
    } else if (diffHours <= 24) {
      return diffHours == 1
        ? `${diffHours} Hour ago`
        : `${diffHours} Hours ago`;
    } else if (diffDays <= 7) {
      return diffDays == 1 ? `${diffDays} Day ago` : `${diffDays} Days ago`;
    } else {
      return `${
        monthNames[postedTime.getMonth()]
      } ${postedTime.getDate()}, ${postedTime.getFullYear()}`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <MaterialCommunityIcons
          style={styles.avatar}
          name={"account"}
          size={35}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>{author} </Text>
          <Text style={{ fontSize: 14 }}>{body}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 12, color: "#666" }}>
        {calculateTimeDifference()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
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
    marginVertical: 2,
  },
});

export default Comment;
