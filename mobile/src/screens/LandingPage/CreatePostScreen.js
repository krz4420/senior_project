import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Button,
  Image,
  StyleSheet,
} from "react-native";
import CustomInput from "../../components/CustomInput";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import { BACKENDPOINT } from "../../utils";

const CreatePostScreen = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [validForm, setValidForm] = useState(true);

  const auth = useAuth();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      setTitle("");
      setDescription("");
      setMedia([]);
      setValidForm(true);
    });
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
      await axios
        .post(`${BACKENDPOINT}/Post/create/image`, imageBodyData, {
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
          alert("Sorry, something went wrong. Image was not uploaded!");
        });
    }
    console.log(fileData);

    if (hasVideo) {
      await axios
        .post(`${BACKENDPOINT}/Post/create/video`, videoBodyData, {
          headers: {
            accept: "application/json",
            "Content-Type": `multipart/form-data`,
          },
        })
        .then((res) => {
          res.data.map((file) => {
            console.log(file);
            fileData.push({
              filename: file.filename,
              filetype: file.contentType,
            });
          });
        })
        .catch((error) => {
          alert("Sorry, something went wrong. Video was not uploaded!");
        });
    }

    const postData = {
      title,
      user: auth.authData.username,
      group: props.route.params.groupName,
      file: fileData,
      description: description,
    };

    try {
      createPost(postData);
      alert("Post created successfully!");
    } catch (err) {
      alert("Sorry, something went wrong. Post was not created!");
    }
  };

  const createPost = async (postData) => {
    await axios
      .post(`${BACKENDPOINT}/Post/create/post`, postData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        alert("Sorry, something went wrong. Post was not created!");
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
      />

      <CustomInput
        placeholder="Description"
        value={description}
        setValue={setDescription}
        autoCapitalize={false}
        onFocus={setValidForm}
        multiline={true}
      />
      <Button
        title="Pick images or videos from your camera roll"
        onPress={pickImage}
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
      <CustomButton text="Create Post" onPress={onCreatePost} />
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
