import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../screens/LandingPage/FeedScreen";
import CommentSection from "../screens/LandingPage/CommentSection";
import PostSection from "../screens/LandingPage/PostSection";

const Stack = createNativeStackNavigator();

const FeedStack = (props) => {
  const groupName = props.route.params.groupName;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed Screen"
        component={FeedScreen}
        initialParams={{ groupName }}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen name="Comment Section" component={CommentSection} />
      <Stack.Screen
        name="Post Section"
        component={PostSection}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
};

export default FeedStack;
