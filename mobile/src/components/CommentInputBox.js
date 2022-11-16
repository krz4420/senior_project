import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  Pressable,
} from "react-native";

const CommentSectionView = ({
  handleSubmitComment,
  body,
  setBody,
  keyboardOffset,
}) => {
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

export default CommentSectionView;
