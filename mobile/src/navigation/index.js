import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import HomeScreen from "./HomeScreen";
import { useAuth } from "../context/Auth";

const Navigation = () => {
  const { authData } = useAuth();
  // Depending on the user's auth status, render the appropriate screens
  return (
    <NavigationContainer>
      {authData ? <HomeScreen /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
