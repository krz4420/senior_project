import React from "react";
import FeedStack from "./FeedStack";
import CreatePostScreen from "../screens/LandingPage/CreatePostScreen";
import LeaderBoardScreen from "../screens/LandingPage/LeaderboardScreen";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileStack from "./ProfileStack";

const Tab = createMaterialBottomTabNavigator();

const TabNav = (props) => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Leaderboard"
        component={LeaderBoardScreen}
        initialParams={{ groupName: props.route.name }}
        options={{
          tabBarLabel: "Leaderboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Feed"
        component={FeedStack}
        initialParams={{ groupName: props.route.name }}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="image-search"
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        group={props.route.name}
        name="Create Post"
        component={CreatePostScreen}
        initialParams={{ groupName: props.route.name }}
        options={{
          tabBarLabel: "Create Post",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="camera" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        initialParams={{ groupName: props.route.name }}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;
