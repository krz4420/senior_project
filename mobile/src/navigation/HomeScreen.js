import React from "react";
import DrawerNav from "./Drawer";
import TabNav from "./Tab";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// Stack navigator combining the tab and drawer navigators for the landing page of the app
const HomeScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={DrawerNav} />
      <Stack.Screen name="Tab" component={TabNav} />
    </Stack.Navigator>
  );
};

export default HomeScreen;
