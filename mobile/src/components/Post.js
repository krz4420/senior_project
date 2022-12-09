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
import { Video } from "expo-av";
import { useAuth } from "../context/Auth";
import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";

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

  const navigation = useNavigation();
  const auth = useAuth();

  useEffect(() => {
    hasUserLikedPost ? setLiked(true) : setLiked(false);
    setLikeCount(likes);
  }, [likes, hasUserLikedPost]);

  const confirmDelete = async () => {
    await axios
      .post(`${BACKENDPOINT}/Post/delete`, { postID: id })
      .then(navigation.goBack())
      .catch(() => {
        Alert.alert("An Error has occured", "The post was not deleted");
      });
  };

  const handleDeletePost = async () => {
    Alert.alert("WARNING⚠️", "Are you sure you want to delete the post?", [
      {
        text: "Delete",
        onPress: confirmDelete,
        style: "destructive",
      },
      { text: "Cancel" },
    ]);
  };
  const handleLikePress = async (totalLikes) => {
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

    await axios
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
        {filename &&
        filetype &&
        (filetype.includes("image") ||
          filetype.includes("jpg") ||
          filetype.includes("jpeg")) ? (
          <Pressable onPress={handlePostNavigation}>
            <Image
              style={styles.image}
              source={{
                uri: `${BACKENDPOINT}/Post/retrieve/image?name=${filename}`,
              }}
            />
          </Pressable>
        ) : null}
        {filename && filetype && filetype.includes("video") ? (
          <Video
            useNativeControls
            style={styles.video}
            source={{
              uri: `${BACKENDPOINT}/Post/retrieve/video?name=${filename}`,
            }}
            onError={(error) => console.error(error)}
            isMuted={false}
          />
        ) : null}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
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
        {auth.authData.username == author ? (
          <Pressable
            onPress={handleDeletePost}
            style={{ alignContent: "flex-end" }}
          >
            <MaterialCommunityIcons color="#E053" name={"delete"} size={20} />
          </Pressable>
        ) : null}
      </View>

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
  video: {
    margin: 8,
    height: 359,
    width: 202,
    backgroundColor: "grey",
  },
});

export default Post;
