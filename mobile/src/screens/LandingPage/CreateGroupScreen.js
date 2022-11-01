import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";
import { useAuth } from "../../context/Auth";

const CreateGroupScreen = () => {
  const [groupId, setGroupId] = useState("");
  const [isValidId, setValidId] = useState(true);
  const [isGroupIdNotTaken, setGroupIdNotTaken] = useState(true);
  const auth = useAuth();

  const onSubmitPressed = ({ navigation }) => {
    if (!isValidId || !isGroupIdNotTaken) {
      return;
    } else {
      const data = { groupname: groupId, username: auth.authData.username };

      // Check if the group id is already taken
      axios
        .post(`${BACKENDPOINT}/Group/create`, data)
        .then((res) => {
          console.log(res);
          auth.updateGroup(groupId, auth.authData);
          alert(`Successfull created ${groupId}`);
        })
        .catch((error) => {
          console.error(error.response.data);
          if ((error.response.data.message = "Group ID is taken")) {
            setGroupIdNotTaken(false);
            return;
          } else {
            // Either display success message or navigate the user to the feed for the group they just created.
          }
        });
    }
    console.warn("Submit");
  };

  const handleValidGroupId = (e) => {
    setGroupIdNotTaken(true);
    setValidId(true);
    if (e.length < 4) {
      setValidId(false);
    } else {
      setValidId(true);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create Group</Text>

        <CustomInput
          placeholder="Enter Group ID"
          value={groupId}
          setValue={setGroupId}
          autoCapitalize={false}
          onEndEditing={(e) => handleValidGroupId(e.nativeEvent.text)}
        />

        {isValidId ? null : (
          <Text style={styles.error}>
            Group ID Must be at least 4 characters
          </Text>
        )}
        {isGroupIdNotTaken ? null : (
          <Text style={styles.error}>Group ID is already Taken.</Text>
        )}

        <CustomButton text="Submit" onPress={onSubmitPressed} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    color: "#051c60",
  },
  text: {
    color: "gray",
    marginVertical: 10,
  },
  link: {
    color: "#FdB075",
  },
  error: {
    color: "red",
  },
});

export default CreateGroupScreen;
