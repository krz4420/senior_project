import React from "react";
import DrawerNav from "./Drawer";
import TabNav from "./Tab";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={DrawerNav} />
      <Stack.Screen name="Tab" component={TabNav} />
    </Stack.Navigator>
  );
};

export default HomeScreen;
