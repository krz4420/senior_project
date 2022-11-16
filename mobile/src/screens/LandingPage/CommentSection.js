import React, { useState, useEffect, useRef } from "react";
import CommentSectionView from "../../components/CommentSectionView";
import CommentInputBox from "../../components/CommentInputBox";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";
import { ScrollView, Keyboard } from "react-native";

const CommentSection = (props) => {
  const auth = useAuth();
  const [body, setBody] = useState("");

  const { comments, id, author, timestamp, description } = props.route.params;
  const [allComments, setAllComments] = useState(comments);
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
  const handleSubmitComment = async (comment) => {
    const data = {
      postID: props.id,
      username: auth.authData.username,
      body: comment,
    };

    // If the comment is nothing besides white space then alert the user
    const noWhiteSpace = comment.replace(/\s/g, "");
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
            body: comment,
          },
        ]);
      })
      .catch((error) => {
        console.log(error);
        alert("Error: Comment was not created");
      });
  };

  return (
    <>
      <ScrollView
        style={{ marginTop: 60 + keyboardOffset, bottom: keyboardOffset + 60 }}
      >
        <CommentSectionView
          comments={comments}
          id={id}
          author={author}
          timestamp={timestamp}
          description={description}
          allComments={allComments}
        />
      </ScrollView>

      <CommentInputBox
        handleSubmitComment={handleSubmitComment}
        body={body}
        setBody={setBody}
        keyboardOffset={keyboardOffset}
      />
    </>
  );
};

export default CommentSection;
