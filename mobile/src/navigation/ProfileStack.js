import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/LandingPage/ProfileScreen";
import PostSection from "../screens/LandingPage/PostSection";

const Stack = createNativeStackNavigator();

const ProfileStack = (props) => {
  const groupName = props.route.params.groupName;
  console.log(props);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile Page"
        component={ProfileScreen}
        initialParams={{ groupName }}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Post Section"
        options={({ route }) => ({ title: route.params.title })}
        component={PostSection}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
