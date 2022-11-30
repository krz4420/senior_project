import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JoinGroupScreen from "../screens/LandingPage/JoinGroupScreen";
import CreateGroupScreen from "../screens/LandingPage/CreateGroupScreen";

const Stack = createNativeStackNavigator();

// Navigation stack for the add and join groups
const GroupStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Join Group" component={JoinGroupScreen} />
      <Stack.Screen name="Create Group" component={CreateGroupScreen} />
    </Stack.Navigator>
  );
};

export default GroupStack;
