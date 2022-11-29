import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { BACKENDPOINT, calculateTimeDifference } from "../utils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Video } from "expo-av";
import axios from "axios";
import { useAuth } from "../context/Auth";

const Post = ({
  title,
  description,
  author,
  timestamp,
  files,
  likes,
  comments,
  id,
  hasUserLikedPost,
  handleCommentPress,
  handlePostNavigation,
}) => {
  const [isLiked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const auth = useAuth();

  useEffect(() => {
    hasUserLikedPost ? setLiked(true) : setLiked(false);
    setLikeCount(likes);
  }, [likes, hasUserLikedPost]);

  const handleLikePress = (totalLikes) => {
    let totLikes = totalLikes;
    if (isLiked) {
      setLiked(false);
      setLikeCount(totLikes - 1);
      likes -= 1;
    } else {
      setLiked(true);
      setLikeCount(totLikes + 1);
      likes += 1;
    }

    axios
      .post(`${BACKENDPOINT}/Post/like`, {
        postID: id,
        userID: auth.authData.userId,
      })
      .catch(() =>
        Alert.alert("An Error has occured", "Please try liking again!")
      );
  };

  // Map over all the images/videos for the specific post and render them out
  const media = files.map(({ filename, filetype }, index) => {
    return (
      <View key={index}>
        <Pressable onPress={handlePostNavigation}>
          {filename &&
          filetype &&
          (filetype.includes("image") ||
            filetype.includes("jpg") ||
            filetype.includes("jpeg")) ? (
            <Image
              style={styles.image}
              source={{
                uri: `${BACKENDPOINT}/Post/retrieve/image?name=${filename}`,
              }}
            />
          ) : null}
          {filename && filetype && filetype.includes("video") ? (
            <Video
              useNativeControls
              style={styles.image}
              source={
                {
                  // uri: `${BACKENDPOINT}/Post/retrieve/video?name=${filename}`,
                  // uri: `http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4`,
                  // uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                  // uri: require("../utils/video2.mp4"),
                }
              }
              onError={(error) => console.error(error)}
              onReadyForDisplay={(data) => console.error(data)}
            />
          ) : null}
        </Pressable>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePostNavigation}>
        <View style={styles.userInfo}>
          <MaterialCommunityIcons
            style={styles.avatar}
            name={"account"}
            size={50}
          />
          <View style={styles.textInfo}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>{author}</Text>
            <Text style={{ fontSize: 12, color: "#666" }}>
              {calculateTimeDifference(timestamp)}
            </Text>
          </View>
        </View>
      </Pressable>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.imageContainer}
        centerContent={true}
      >
        {media}
      </ScrollView>
      <Pressable onPress={handlePostNavigation}>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>{title}</Text>
        {description ? <Text>{description}</Text> : null}
        <View style={styles.divider} />
      </Pressable>
      <View style={styles.interactionWrapper}>
        <TouchableOpacity
          style={styles.likeWrapper}
          onPress={() => handleLikePress(likeCount)}
        >
          <MaterialCommunityIcons
            name={isLiked ? "heart" : "heart-outline"}
            size="25"
          />
          <Text style={{ marginTop: 3 }}>
            {likeCount == 1 ? `1 Like` : `${likeCount} Likes`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.likeWrapper}
          onPress={() => handleCommentPress()}
        >
          <MaterialCommunityIcons name={"chat-outline"} size="25" />
          <Text style={{ marginTop: 3 }}>
            {comments.length == 0
              ? "Comment"
              : comments.length == 1
              ? "1 Comment"
              : `${comments.length} Comments`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  divider: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    width: "100%",
    alignSelf: "center",
    marginVertical: 5,
  },
  likeWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 5,
    padding: 2,
  },
  interactionWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 50,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#F9FBFC",
    width: "100%",
    padding: 5,
    borderColor: "#F9FBFC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 3,
    alignContent: "center",
  },
  image: {
    margin: 8,
    height: 256,
    width: 256,
    backgroundColor: "grey",
  },
});

export default Post;
