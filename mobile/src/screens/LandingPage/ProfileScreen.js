import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Pressable,
  Image,
} from "react-native";
import { useAuth } from "../../context/Auth";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import image from "../../../assets/image.jpeg";

const ProfileScreen = (props) => {
  const auth = useAuth();
  const isFocused = useIsFocused();
  const [usersPosts, setUsersPosts] = useState([]);
  const [usersLeaderboardPosition, setUsersLeaderboardPosition] =
    useState(null);

  const width = Dimensions.get("window").width;

  useEffect(() => {
    const data = {
      groupname: props.route.params.groupName,
      username: auth.authData.username,
    };

    const fetchFeed = async () => {
      await axios
        .post(`${BACKENDPOINT}/Profile`, data)
        .then(({ data }) => {
          console.log(`Profile screen`, data);
          setUsersLeaderboardPosition(data.leaderboardPosition);
          setUsersPosts(data.usersPost);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchFeed();
  }, [isFocused]);

  // Navigates user to a more indepth view of the post
  const handleOnPress = (post) => {
    props.navigation.navigate("Post Section", {
      title: post.title,
      post: post,
    });
  };

  const posts = usersPosts.map((post, index) => {
    // db model is inconsistent becuase of changes. Have to test for the existence of the file array
    // CHANGE in the future when the db is reset.
    const uri =
      post.file &&
      post.file[0] &&
      post.file[0].filetype &&
      post.file[0].filename &&
      !post.file[0].filetype.includes("video")
        ? `${BACKENDPOINT}/Post/retrieve/image?name=${post.file[0].filename}`
        : image;

    return (
      <Pressable key={index} onPress={() => handleOnPress(post)}>
        <View
          style={{
            width: width * 0.32,
            height: width * 0.32,
            marginHorizontal: 2,
          }}
        >
          {uri == image ? (
            <Image
              style={{ flex: 1, width: width * 0.32, height: width * 0.32 }}
              source={image}
            />
          ) : (
            <Image
              style={{ flex: 1 }}
              source={{
                uri: uri,
              }}
            />
          )}
        </View>
      </Pressable>
    );
  });

  return (
    <ScrollView>
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <MaterialCommunityIcons
              style={styles.avatar}
              name={"account"}
              size={100}
            />
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              {auth.authData.username}
            </Text>
          </View>
          <View style={{ marginTop: 15, flex: 3 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View style={{ alignItems: "center" }}>
                <Text>{usersPosts.length}</Text>
                <Text style={{ fontSize: 11, color: "grey" }}>posts</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text>{usersLeaderboardPosition}</Text>
                <Text style={{ fontSize: 11, color: "grey" }}>
                  Leaderboard Position
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable style={styles.edit}>
                <TouchableOpacity>
                  <Text style={{ textAlign: "center" }}>Edit Profile</Text>
                </TouchableOpacity>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.divider]} />
      <View style={{ justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {posts}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  edit: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    width: "95%",
    height: 35,
    justifyContent: "center",
    marginTop: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  divider: {
    marginVertical: 10,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
    width: "100%",
    alignSelf: "center",
  },
});
export default ProfileScreen;
