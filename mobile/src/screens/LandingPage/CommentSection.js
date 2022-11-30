import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Keyboard } from "react-native";

import CommentSectionView from "../../components/CommentSectionView";
import CommentInputBox from "../../components/CommentInputBox";

const CommentSection = (props) => {
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
