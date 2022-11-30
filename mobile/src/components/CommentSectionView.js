import React from "react";
import { View, StyleSheet } from "react-native";

import Comment from "./Comment";

const CommentSectionView = (props) => {
  const { allComments, author, timestamp, description } = props;

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

  return (
    <View style={{ backgroundColor: "#F9FBFC", height: "100%" }}>
      <Comment author={author} time={timestamp} body={description} />
      <View style={styles.divider} />
      {commentsView}
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
