import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LogInScreen from "../screens/Registration/LogInScreen";
import SignUpScreen from "../screens/Registration/SignUpScreen";
import ConfirmEmailScreen from "../screens/Registration/ConfirmEmailScreen";
import ForgotPasswordScreen from "../screens/Registration/ForgotPasswordScreeen";
import ResetPasswordScreen from "../screens/Registration/ResetPasswordScreen";

const Stack = createNativeStackNavigator();

// Stack used for the authorization process
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Log In" component={LogInScreen} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
      <Stack.Screen name="Confirm Email" component={ConfirmEmailScreen} />
      <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
      <Stack.Screen name="Reset Password" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
