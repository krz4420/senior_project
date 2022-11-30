import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshControl,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BACKENDPOINT, wait } from "../../utils";
import Post from "../../components/Post";
import { useAuth } from "../../context/Auth";

// Constant for the number of posts to fetch at a time for lazy-loading
const POST_LIMIT = 10;

const FeedScreen = (props) => {
  const auth = useAuth();
  const isFocused = useIsFocused();

  const [postsData, setPostsData] = useState([]);
  const [lastPost, setLastPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedAllPosts, setFetchedAllPosts] = useState(false);

  // Handles Refreshes and waits for the fetchFeed call to finish then waits another second to switch refreshing off for the UX.
  const onRefresh = useCallback(() => {
    setIsLoading(true);
    fetchFeed().then(wait(1000).then(() => setIsLoading(false)));
  }, []);

  // Function for lazy fetch of the feed. Fetches 10 posts at a time and stores the last post it fetched.
  const fetchFeed = async () => {
    // Return right away if the user fetched all the posts for the group
    if (fetchedAllPosts) return;

    setIsLoading(true);

    // Data that will be sent to the backend.
    const data = {
      group: props.route.params.groupName,
      limit: POST_LIMIT,
      lastPost,
    };

    // Try to ping backend and retrieve posts
    try {
      await axios
        .post(`${BACKENDPOINT}/Post/retrieve/post`, data)
        .then(({ data }) => {
          // Backend returns an empty array if the user has loaded all the posts.
          if (data.length == 0) {
            setFetchedAllPosts(true);
            setIsLoading(false);
            return;
          }

          // Add the posts returned from backend to the postsData array
          setPostsData([...postsData, ...data]);

          // Update the last post
          setLastPost(data[data.length - 1].createdAt);
        });
    } catch (error) {
      Alert.alert("Error!", "Could not fetch posts. Please try again.");
      console.error(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      fetchFeed();
    }
  }, [isFocused]);

  // Create the posts array
  const posts = postsData.map((post) => {
    let files;

    // Data models in the db was changed and some posts don't have an array to store files.
    // Can get rid off when the database is reset/cleared
    if (post.file.length == 0) {
      files = [{ filename: post.filename, filetype: "image" }];
    } else {
      files = post.file;
    }

    // Check if the user has likes the post
    let hasUserLikedPost = post.likes.includes(auth.authData.userId)
      ? true
      : false;

    // Function to handle when the comment button is pressed
    const handleCommentPress = () => {
      props.navigation.navigate("Comment Section", {
        comments: post.comments,
        id: post._id,
        author: post.user,
        timestamp: post.createdAt,
        description: post.description ? post.description : null,
      });
    };

    // Function to navigate user to post screen when the user presses the post
    const handlePostNavigation = () => {
      props.navigation.navigate("Post Section", {
        post: post,
        title: post.title,
      });
    };

    return (
      <Post
        key={post._id}
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
        handlePostNavigation={handlePostNavigation}
      />
    );
  });

  // Render the activity icon at the bottom of the list when refreshing
  const renderFooter = () => {
    try {
      // Check If Loading
      if (isLoading) {
        return <ActivityIndicator />;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <FlatList
        data={posts}
        renderItem={({ item }) => {
          return <>{item}</>;
        }}
        onEndReached={fetchFeed}
        onEndReachedThreshold={0}
        refreshing={isLoading}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        ListFooterComponent={renderFooter}
        keyExtractor={(item, index) => String(index)}
      />
    </SafeAreaView>
  );
};

export default FeedScreen;
