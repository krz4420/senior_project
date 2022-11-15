import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  Pressable,
} from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import Comment from "../../components/Comment";

import axios from "axios";
import { BACKENDPOINT } from "../../utils";
import { useAuth } from "../../context/Auth";

const CommentSection = (props) => {
  const [body, setBody] = useState("");
  const { comments, id, author, timestamp, description } = props.route.params;
  const [allComments, setAllComments] = useState(comments);

  const auth = useAuth();

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

  const commentsView = allComments.map((comment, index) => {
    return (
      <View key={index}>
        <Comment
          author={comment.author}
          body={comment.body}
          time={comment.time}
        />
      </View>
    );
  });

  const handleSubmitComment = async () => {
    const data = { postID: id, username: auth.authData.username, body };

    // If the comment is nothing besides white space then alert the user
    const noWhiteSpace = body.replace(/\s/g, "");
    if (noWhiteSpace == "") {
      alert("Please enter a comment!");
      setBody("");
      return;
    }

    // Post comment to the backend to be uploaded
    await axios
      .post(`${BACKENDPOINT}/Post/comment`, data)
      .then((data) => {
        alert("Comment created successfully!");
        setBody("");
        // Add the new comment to the state variable for real time update to the user's feed
        setAllComments([
          ...allComments,
          {
            author: auth.authData.username,
            time: Date.now(),
            body,
          },
        ]);
      })
      .catch(() => {
        alert("Error: Comment was not created");
      });
  };

  return (
    <View style={{ backgroundColor: "#F9FBFC" }}>
      <ScrollView
        style={{ marginTop: 60 + keyboardOffset, bottom: keyboardOffset + 60 }}
      >
        <Comment author={author} time={timestamp} body={description} />
        <View style={styles.divider} />
        {commentsView}
      </ScrollView>
      <View style={[styles.commentContainer, { bottom: keyboardOffset }]}>
        <TextInput
          style={styles.commentBox}
          onSubmitEditing={Keyboard.dismiss}
          placeholder="Enter a comment..."
          placeholderTextColor="#000"
          keyboardType="default"
          value={body}
          onChangeText={setBody}
          multiline
        />
        <View>
          <Pressable style={styles.submitButton} onPress={handleSubmitComment}>
            <Text style={styles.buttonText}>Post</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    position: "absolute",
    width: "100%",
    borderColor: "#dedede",
    borderTopWidth: 1,
    padding: 10,
    backgroundColor: "#F9FBFC",
    flexDirection: "row",
  },
  commentBox: {
    fontSize: 16,
    width: "80%",
  },
  submitButton: {
    backgroundColor: "#dedede",
    marginHorizontal: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 40,
    borderColor: "#dedede",
  },
  divider: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    width: "100%",
    alignSelf: "center",
    marginVertical: 5,
  },
});

export default CommentSection;