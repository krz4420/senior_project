import React, { useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";

const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const [validFrom, setValidForm] = useState(true);

  const onSendPressed = async () => {
    // Validate the username exists
    await axios
      .post(`${BACKENDPOINT}/ResetPassword/reset`, { username })
      .then((res) => {
        const email = res.data.email;
        // If no error is returned then the information the user entered corresponds to an account
        navigation.navigate("Reset Password", { username, email });
      })
      .catch((err) => {
        error = err.response.data.message;
        console.error(error);
        // Set state for valid form to false to render error message
        setValidForm(false);
      });
  };

  const onLogInPressed = () => {
    navigation.navigate("Log In");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Forgot your password?</Text>
        {validFrom ? null : <Text style={styles.error}>Invalid Username!</Text>}
        <CustomInput
          placeholder="Enter Username"
          value={username}
          setValue={setUsername}
          autoCapitalize={false}
          onFocus={setValidForm}
        />

        <CustomButton text="Submit" onPress={onSendPressed}></CustomButton>

        <CustomButton
          text="Back to Sign In"
          onPress={onLogInPressed}
          type="TERTIARY"
        ></CustomButton>
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

export default ForgotPasswordScreen;
