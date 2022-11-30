import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";
import { useAuth } from "../../context/Auth";

const JoinGroupScreen = () => {
  const [groupId, setGroupId] = useState("");
  const [noError, setNoError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();

  const onSubmitPressed = async () => {
    // Check if the group id is valid
    await axios
      .post(`${BACKENDPOINT}/Group/join`, {
        username: auth.authData.username,
        groupname: groupId,
        userID: auth.authData.userId,
      })
      .then((res) => {
        auth.updateGroup(groupId, auth.authData);
        console.log(res);
        Alert.alert("Success!", `${groupId} has been joined!🎉`);
      })
      .catch((error) => {
        setNoError(false);
        setErrorMessage(error.response.data.message);
        setTimeout(() => {
          setNoError(true);
        }, 3000);
      });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Add Group</Text>

        <CustomInput
          placeholder="Enter Group ID"
          value={groupId}
          setValue={setGroupId}
          autoCapitalize={false}
        />

        {noError ? null : <Text style={styles.error}>{errorMessage}</Text>}
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

export default JoinGroupScreen;
