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
import axios from "axios";
import { useAuth } from "../../context/Auth";
import { BACKENDPOINT } from "../../utils";

const uploadMedia = async (bodyData, fileData, media) => {
  await axios
    .post(`${BACKENDPOINT}/Post/create/${media}`, bodyData, {
      headers: {
        accept: "application/json",
        "Content-Type": `multipart/form-data;}`,
      },
    })
    .then((res) => {
      res.data.map((file) => {
        fileData.push({
          filename: file.filename,
          filetype: file.contentType,
        });
      });
    })
    .catch((error) => {
      throw error;
    });
};

const CreatePostScreen = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [validForm, setValidForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const cleanState = () => {
    setTitle("");
    setDescription("");
    setMedia([]);
    setValidForm(true);
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {});
    cleanState();
    return unsubscribe;
  }, [props.navigation]);

  const pickImage = async () => {
    setValidForm(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMedia([
        ...media,
        { uri: result.uri, type: result.type, name: result.fileName },
      ]);
    }
  };

  const onCreatePost = async () => {
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

  const createPost = async (postData) => {
    await axios
      .post(`${BACKENDPOINT}/Post/create/post`, postData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        throw error;
      });
  };

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
          ) : null
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
        onPress={onCreatePost}
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
});

export default CreatePostScreen;
