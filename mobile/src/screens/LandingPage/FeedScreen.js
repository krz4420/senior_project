import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { BACKENDPOINT } from "../../utils";
import Post from "../../components/Post";

const FeedScreen = (props) => {
  const [postsData, setPostsData] = useState([]);
  const isFocused = useIsFocused();

  const fetchFeed = () => {
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
    if (isFocused) {
      fetchFeed();
    }
  }, [isFocused]);

  const posts = postsData.map((post) => {
    console.log(post);
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
      />
    );
  });
  return <ScrollView>{posts}</ScrollView>;
};

export default FeedScreen;
