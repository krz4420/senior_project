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
        id={id}
        body={body}
        setBody={setBody}
        keyboardOffset={keyboardOffset}
        allComments={allComments}
        setAllComments={setAllComments}
      />
    </>
  );
};

export default CommentSection;
