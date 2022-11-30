import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Keyboard,
} from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";

const SignUpScreen = () => {
  const navigation = useNavigation();

  // State to keep track of values in the forms
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [password, setPassword] = useState("");

  // State used to handle validation and conditionally rendering error messages
  const [validForm, setValidForm] = useState({
    validUsername: true,
    validPassword: true,
    validRepeatPassword: true,
    validEmail: true,
    usernameNotTaken: true,
    emailNotTaken: true,
  });

  const isFormEmpty = () => {
    const userData = [username, email, repeatPassword, password];

    if (Object.values(userData).every((val) => val.length == 0)) {
      return true;
    } else {
      return false;
    }
  };

  const isValidForm = () => {
    if (
      Object.values(validForm).every((val) => val == true) &&
      !isFormEmpty()
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Handles when user clicks sign up.
  const onSignUpPressed = async () => {
    setValidForm((prevState) => ({ ...prevState, usernameNotTaken: true }));
    setValidForm((prevState) => ({ ...prevState, emailNotTaken: true }));
    // If the information the user inputted is valid, then check to see if username and email are not used already.
    if (isValidForm()) {
      // Extract user information
      const userInfo = { username, email, password };

      // Ping backend to see if the username or email is already taken
      await axios
        .post(`${BACKENDPOINT}/SignUp`, userInfo)
        .then(() => {
          navigation.navigate("Log In");
        })
        .catch((err) => {
          console.error(error);
          error = err.response.data.message;

          if (error == "Username and Email Taken!") {
            setValidForm((prevState) => ({
              ...prevState,
              usernameNotTaken: false,
            }));
            setValidForm((prevState) => ({
              ...prevState,
              emailNotTaken: false,
            }));
          } else if (error == "Username Taken!") {
            setValidForm((prevState) => ({
              ...prevState,
              usernameNotTaken: false,
            }));
          } else if (error == "Email Taken!") {
            setValidForm((prevState) => ({
              ...prevState,
              emailNotTaken: false,
            }));
          }
        });
    }

    // navigation.navigate('Confirm Email')
  };

  // Navigate user to Log In page
  const onLogIn = () => {
    navigation.navigate("Log In");
  };

  // Navigate to Privacy file
  const onPrivacyPress = () => {
    navigation.navigate("Privacy");
  };

  // Navigate to Terms file
  const onTermsPress = () => {
    navigation.navigate("Terms");
  };

  // Validate username and update state based on value for username
  const handleValidUser = (val) => {
    if (val.length < 4) {
      setValidForm((prevState) => ({ ...prevState, validUsername: false }));
    } else {
      setValidForm((prevState) => ({ ...prevState, validUsername: true }));
    }
  };

  // Validate email and update state based on value for email
  const handleValidEmail = (val) => {
    if (val.length < 4) {
      setValidForm((prevState) => ({ ...prevState, validEmail: false }));
    } else {
      setValidForm((prevState) => ({ ...prevState, validEmail: true }));
    }
  };

  const onChangeUsername = () => {
    setValidForm((prevState) => ({ ...prevState, usernameNotTaken: true }));
  };
  const onChangeEmail = () => {
    setValidForm((prevState) => ({ ...prevState, emailNotTaken: true }));
  };

  // Validate password and update state based on value for password
  const handleValidPass = (val) => {
    if (val.length < 4) {
      setValidForm((prevState) => ({ ...prevState, validPassword: false }));
    } else {
      setValidForm((prevState) => ({ ...prevState, validPassword: true }));
    }
  };

  // Validate passwords match
  const handleValidRepeat = (val) => {
    if (password != repeatPassword) {
      setValidForm((prevState) => ({
        ...prevState,
        validRepeatPassword: false,
      }));
    } else {
      setValidForm((prevState) => ({
        ...prevState,
        validRepeatPassword: true,
      }));
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an Account!</Text>

        <CustomInput
          placeholder="Username"
          value={username}
          setValue={setUsername}
          autoCapitalize={false}
          onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
          onPressOut={onChangeUsername}
        />

        {validForm.validUsername ? null : (
          <Text style={styles.error}>
            Username must be at least 4 characters long!
          </Text>
        )}
        {validForm.usernameNotTaken ? null : (
          <Text style={styles.error}>Username already taken!</Text>
        )}

        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          autoCapitalize={false}
          onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)}
          onPressOut={onChangeEmail}
        />

        {validForm.validEmail ? null : (
          <Text style={styles.error}>Please enter a valid email address!</Text>
        )}

        {validForm.emailNotTaken ? null : (
          <Text style={styles.error}>
            Email already in use with another account!
          </Text>
        )}

        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
          autoCapitalize={false}
          onEndEditing={(e) => handleValidPass(e.nativeEvent.text)}
        />
        {validForm.validPassword ? null : (
          <Text style={styles.error}>
            Password must be at least 8 characters long!
          </Text>
        )}

        <CustomInput
          placeholder="Re-enter Password"
          value={repeatPassword}
          setValue={setRepeatPassword}
          secureTextEntry
          autoCapitalize={false}
          onEndEditing={(e) => handleValidRepeat(e.nativeEvent.text)}
        />
        {validForm.validRepeatPassword ? null : (
          <Text style={styles.error}>Passwords must match!</Text>
        )}

        <CustomButton text="Sign Up" onPress={onSignUpPressed} />

        <Text style={styles.text}>
          By Registering, you confirm that you accept our {}
          <Text style={styles.link} onPress={onTermsPress}>
            Terms of Use
          </Text>{" "}
          and {}
          <Text style={styles.link} onPress={onPrivacyPress}>
            Privacy Policy
          </Text>
        </Text>

        <CustomButton
          text="Have an account? Log In!"
          onPress={onLogIn}
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

export default SignUpScreen;
