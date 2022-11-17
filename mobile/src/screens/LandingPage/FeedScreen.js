import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Pressable,
} from "react-native";
import { BACKENDPOINT } from "../../utils";
import Post from "../../components/Post";
import { useAuth } from "../../context/Auth";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const FeedScreen = (props) => {
  const [postsData, setPostsData] = useState([]);
  const isFocused = useIsFocused();
  const auth = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  // Handles Refreshes and waits for the fetchFeed call to finish then waits another second to switch refreshing off for the UX.
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchFeed().then(wait(1000).then(() => setRefreshing(false)));
  }, []);

  const fetchFeed = async () => {
    axios
      .get(
        `${BACKENDPOINT}/Post/retrieve/post?group=${props.route.params.groupName}`
      )
      .then((res) => {
        setPostsData(res.data);
      })
      .catch((err) => {
        alert("Could not fetch posts. Please try again.");
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchFeed();
    }
  }, [isFocused]);

  const posts = postsData.map((post) => {
    let files;
    if (post.file.length == 0) {
      files = [{ filename: post.filename, filetype: "image" }];
    } else {
      files = post.file;
    }
    let hasUserLikedPost = post.likes.includes(auth.authData.userId)
      ? true
      : false;

    const handleCommentPress = () => {
      props.navigation.navigate("Comment Section", {
        comments: post.comments,
        id: post._id,
        author: post.user,
        timestamp: post.createdAt,
        description: post.description ? post.description : null,
      });
    };

    return (
      <Pressable
        onPress={() => {
          props.navigation.navigate("Post Section", {
            post: post,
            title: post.title,
          });
        }}
        key={post._id}
      >
        <Post
          title={post.title}
          files={files}
          author={post.user}
          timestamp={post.createdAt}
          description={post.description ? post.description : null}
          likes={post.likes.length}
          comments={post.comments}
          id={post._id}
          hasUserLikedPost={hasUserLikedPost}
          handleCommentPress={handleCommentPress}
        />
      </Pressable>
    );
  });

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedScreen;
