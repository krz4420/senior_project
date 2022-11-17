import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  Pressable,
} from "react-native";

import axios from "axios";
import { BACKENDPOINT } from "../utils";
import { useAuth } from "../context/Auth";

const CommentInputBox = ({
  id,
  body,
  setBody,
  keyboardOffset,
  setAllComments,
  allComments,
}) => {
  const auth = useAuth();
  const handleSubmitComment = async (comment) => {
    const data = {
      postID: id,
      username: auth.authData.username,
      body,
    };

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
        // Add the new comment to the state variable for real time update to the user's feed
        setAllComments([
          ...allComments,
          {
            author: auth.authData.username,
            time: Date.now(),
            body,
          },
        ]);
        setBody("");
      })
      .catch((error) => {
        console.log(error);
        alert("Error: Comment was not created");
      });
  };
  return (
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
        <Pressable
          style={styles.submitButton}
          onPress={() => handleSubmitComment(body)}
        >
          <Text style={styles.buttonText}>Post</Text>
        </Pressable>
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

export default CommentInputBox;
