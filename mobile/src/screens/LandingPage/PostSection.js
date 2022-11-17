import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrillView,
  ScrollView,
  Keyboard,
} from "react-native";
import Post from "../../components/Post";
import { useAuth } from "../../context/Auth";
import CommentSectionView from "../../components/CommentSectionView";
import CommentInputBox from "../../components/CommentInputBox";

const PostSection = (props) => {
  const auth = useAuth();
  const { _id, comments, likes, file, createdAt, description, user, title } =
    props.route.params.post;
  const userLikedPost = likes.includes(auth.authData.userId) ? true : false;

  const [allComments, setAllComments] = useState(comments);
  const [body, setBody] = useState("");

  const handleCommentPress = () => {
    console.log("Hello");
  };

  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);

  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();

  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      "keyboardWillShow",
      onKeyboardShow
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      "keyboardWillHide",
      onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);
  return (
    <>
      <ScrollView
        style={{ marginTop: 60 + keyboardOffset, bottom: keyboardOffset + 60 }}
      >
        <View>
          <Post
            title={title}
            description={description}
            author={user}
            timestamp={createdAt}
            files={file}
            likes={likes.length}
            comments={comments}
            id={_id}
            hasUserLikedPost={userLikedPost}
            handleCommentPress={handleCommentPress}
          />
        </View>
        <View style={[styles.divider]} />

        <View>
          <CommentSectionView
            comments={comments}
            id={_id}
            author={user}
            timestamp={createdAt}
            description={description}
            allComments={allComments}
          />
        </View>
      </ScrollView>
      <CommentInputBox
        id={_id}
        body={body}
        setBody={setBody}
        keyboardOffset={keyboardOffset}
        setAllComments={setAllComments}
        allComments={allComments}
      />
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginTop: 10,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
    width: "100%",
    alignSelf: "center",
  },
});

export default PostSection;
