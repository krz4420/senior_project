import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import CustomInput from "../../components/CustomInput";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../context/Auth";
import { uploadMedia, createPost } from "../../utils";
import { useIsFocused } from "@react-navigation/native";
import { Video } from "expo-av";

const CreatePostScreen = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [validForm, setValidForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const auth = useAuth();

  // Wipe the state and set it to default settings
  const cleanState = () => {
    setTitle("");
    setDescription("");
    setMedia([]);
    setValidForm(true);
    setIsLoading(false);
  };

  // Every time the user navigates to Create Post Screen the state will be cleaned
  useEffect(() => {
    cleanState();
  }, [isFocused]);

  // Prompt the user to pick a picture/video from their camera roll
  const pickImage = async () => {
    setValidForm(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If they didn't cancel then add the image/video to the media state
    if (!result.cancelled) {
      setMedia([
        ...media,
        { uri: result.uri, type: result.type, name: result.fileName },
      ]);
    }
  };

  // Handles when the submit button is pressed
  const onSubmitCreatePost = async () => {
    if (isFormEmpty()) {
      setValidForm(false);
      return;
    }
    setIsLoading(true);

    let videoBodyData = new FormData();
    let imageBodyData = new FormData();

    let hasVideo = false;
    let hasImage = false;

    // Map over all the images and add them to the Form Data.
    media.map((file) => {
      console.log(file);
      if (file.type.includes("image")) {
        hasImage = true;
        imageBodyData.append("file", {
          name: file.name == null ? ".png" : file.name,
          uri: file.uri,
          type: file.type,
        });
      } else {
        hasVideo = true;
        videoBodyData.append("file", {
          name: file.name == null ? ".mov" : file.name,
          uri: file.uri,
          type: file.type,
        });
      }
    });

    let fileData = [];

    // If the post contains an image, send data to upload image endpoint
    if (hasImage) {
      try {
        await uploadMedia(imageBodyData, fileData, "image").catch((error) => {
          Alert.alert(
            "Error",
            "Sorry, something went wrong. Video was not uploaded!"
          );
          setIsLoading(false);
          console.error(error);
          throw error;
        });
      } catch (error) {
        return;
      }
    }

    console.log("FileData", fileData);

    // If the post contains a video, send the data to upload video endpoint
    if (hasVideo) {
      try {
        await uploadMedia(videoBodyData, fileData, "video").catch((error) => {
          Alert.alert(
            "Error",
            "Sorry, something went wrong. Video was not uploaded!"
          );
          setIsLoading(false);
          console.error(error);
          throw error;
        });
      } catch (error) {
        return;
      }
    }

    console.log("FileData2", fileData);

    // Create the post data to send to the backend
    const postData = {
      title,
      user: auth.authData.username,
      group: props.route.params.groupName,
      file: fileData,
      description: description,
    };

    // Send post data to endpoint to create a post object and store in db
    try {
      // Call the function which sends the data to the backend to create a post
      await createPost(postData);
      // Post was created successfully, alert user and clean the input fields
      Alert.alert("Success!", "Post created successfully!");
      cleanState();
      setIsLoading(false);
    } catch (err) {
      Alert.alert(
        "Error",
        "Sorry, something went wrong. Post was not created!"
      );
      setIsLoading(false);
      return;
    }
  };

  // Helper function to test if all inputs are
  const isFormEmpty = () => {
    const userData = [title, description];

    if (
      Object.values(userData).every((val) => val.length == 0) ||
      media.length == 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>
        Create Post for {props.route.params.groupName}
      </Text>
      {validForm ? null : (
        <Text style={styles.error}>
          Please enter a title, description and select an image/video!
        </Text>
      )}
      <CustomInput
        placeholder="Title"
        value={title}
        setValue={setTitle}
        autoCapitalize={false}
        onFocus={setValidForm}
        disabled={isLoading}
      />

      <CustomInput
        placeholder="Description"
        value={description}
        setValue={setDescription}
        autoCapitalize={false}
        onFocus={setValidForm}
        multiline={true}
        disabled={isLoading}
      />
      <Button
        title="Pick images or videos from your camera roll"
        onPress={pickImage}
        disabled={isLoading}
      />
      <View style={styles.imageContainer}>
        {media.map((file) =>
          file.type == "image" ? (
            <Image
              key={file.uri}
              source={{ uri: file.uri }}
              style={styles.image}
            />
          ) : (
            <Video
              useNativeControls
              key={file.uri}
              source={{ uri: file.uri }}
              style={styles.video}
            />
          )
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator
          //visibility of Overlay Loading Spinner
          visible={isLoading}
          //Text with the Spinner
          textContent={"Loading..."}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
      <CustomButton
        text="Create Post"
        disabled={isLoading}
        onPress={onSubmitCreatePost}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  image: {
    width: 170,
    height: 170,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    color: "#051c60",
  },
  error: {
    color: "red",
    borderColor: "red",
  },
  video: {
    marginBottom: 10,
    marginHorizontal: 10,
    height: 180,
    width: 100,
  },
});

export default CreatePostScreen;
