import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView } from "react-native";
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
        console.error("Could not fetch posts. Please try again.");
      });
  };

  useEffect(() => {
    console.log("user ID", auth.authData.userId);
    if (isFocused) {
      fetchFeed();
    }
  }, [isFocused]);

  const posts = postsData.map((post) => {
    // console.log(post);
    let files;
    if (post.file.length == 0) {
      files = [{ filename: post.filename, filetype: "image" }];
    } else {
      files = post.file;
    }
    return (
      <Post
        key={post._id}
        title={post.title}
        files={files}
        author={post.user}
        timestamp={post.createdAt}
        description={post.description ? post.description : null}
        likes={post.likes}
        comments={post.comments}
        id={post._id}
      />
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
