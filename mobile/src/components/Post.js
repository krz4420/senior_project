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
}) => {
  const [isLiked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
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
    const postedTime = new Date(timestamp);
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

  useEffect(() => {
    hasUserLikedPost ? setLiked(true) : setLiked(false);
  }, []);

  const handleLikePress = (totalLikes) => {
    let likes = totalLikes;
    if (isLiked) {
      setLiked(false);
      setLikeCount(likes - 1);
      likes -= 1;
    } else {
      setLiked(true);
      setLikeCount(likes + 1);
      likes += 1;
    }
    console.log(likes);

    axios
      .post(`${BACKENDPOINT}/Post/like`, {
        postID: id,
        userID: auth.authData.userId,
      })
      .then((data) => {
        console.log(data);
      });

    // TODO call the backend and update the number of likes for this post
  };

  const handleCommentPress = () => {
    // TODO navigate to comment section
  };

  // Map over all the images/videos for the specific post and render them out
  const media = files.map(({ filename, filetype }, index) => {
    return (
      <View key={index}>
        {filename &&
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
        {filename && filetype.includes("video") ? (
          <Video
            style={styles.image}
            source={{
              uri: `${BACKENDPOINT}/Post/retrieve/video?name=${filename}`,
            }}
          />
        ) : null}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <MaterialCommunityIcons
          style={styles.avatar}
          name={"account"}
          size={50}
        />
        <View style={styles.textInfo}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>{author}</Text>
          <Text style={{ fontSize: 12, color: "#666" }}>
            {calculateTimeDifference()}
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.imageContainer}
        centerContent={true}
      >
        {media}
      </ScrollView>
      <Text style={{ fontSize: 14, fontWeight: "bold" }}>{title}</Text>
      {description ? <Text>{description}</Text> : null}
      <View style={styles.divider} />
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
          onPress={handleCommentPress}
        >
          <MaterialCommunityIcons name={"chat-outline"} size="25" />
          <Text style={{ marginTop: 3 }}>Comment</Text>
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
    marginVertical: 5,
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
