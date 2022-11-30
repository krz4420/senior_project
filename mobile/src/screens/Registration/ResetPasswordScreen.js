import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet, Alert } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";

const ResetPasswordScreen = ({ route }) => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [validFrom, setValidForm] = useState(true);
  const [validPass, setValidPass] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const { email } = route.params;
    const generateCode = async () => {
      axios
        .post(`${BACKENDPOINT}/ResetPassword/generateCode`, { email })
        .catch((err) => {
          console.error(err);
          setValidForm(false);
          Alert.alert(
            "Error",
            "Code could not be send to email. Double check the username."
          );
        });
    };

    // Ping the backendpoint to generate a random code and email it to email on user's account
    generateCode();
  }, []);

  const onResetPasswordPressed = async () => {
    if (password.length < 4) {
      setValidPass(false);
      console.log("Error with password");
      return;
    }

    const { username, email } = route.params;
    await axios
      .post(`${BACKENDPOINT}/ResetPassword/confirmReset`, {
        code,
        password,
        username,
        email,
      })
      .then((res) => {
        // If no error is returned then the information the user entered corresponds to an account
        navigation.navigate("Log In");
      })
      .catch((err) => {
        error = err.response.data.message
          ? err.response.data.message
          : err.response;
        console.error(error);
        // Set state for valid form to false to render error message
        setValidForm(false);
      });
  };

  const onLogInPressed = () => {
    navigation.navigate("Log In");
  };

  const onNewCode = () => {
    console.warn("Request New Code");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>

        {validFrom ? null : <Text style={styles.error}>Incorrect Code</Text>}

        <CustomInput
          placeholder="Code"
          value={code}
          setValue={setCode}
          onFocus={setValidForm}
          autoCapitalize={false}
        />

        <CustomInput
          placeholder="Enter New Password"
          value={password}
          setValue={setPassword}
          onFocus={setValidPass}
          autoCapitalize={false}
        />

        {validPass ? null : (
          <Text style={styles.error}>
            Password must be at least 8 characters long!
          </Text>
        )}

        <CustomButton text="Reset Password" onPress={onResetPasswordPressed} />

        <CustomButton
          text="Back to Sign In"
          onPress={onLogInPressed}
          type="TERTIARY"
        />
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

export default ResetPasswordScreen;
