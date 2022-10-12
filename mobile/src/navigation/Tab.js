import React from 'react'
import FeedScreen from '../screens/LandingPage/FeedScreen';
import CreatePostScreen from '../screens/LandingPage/CreatePostScreen';
import LeaderBoardScreen from '../screens/LandingPage/LeaderboardScreen';
import ProfileScreen from '../screens/LandingPage/ProfileScreen';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const TabNav = () => {
    return(
          <Tab.Navigator screenOptions={{ headerShown: false }}>  
            <Tab.Screen 
              name="Leaderboard" 
              component={LeaderBoardScreen} 
              options={{
                tabBarLabel: 'Leaderboard',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="chart-line" color={color} size={26} />
                ),
              }}
            />

            <Tab.Screen 
              name="Feed" 
              component={FeedScreen} 
              options={{
                tabBarLabel: 'Feed',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="image-search" color={color} size={26} />
                  ),
                }}
              />

            <Tab.Screen 
              name="Create Post" 
              component={CreatePostScreen} 
              options={{
                tabBarLabel: 'Create Post',
                tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="camera" color={color} size={26} />
                ),
              }}
            />

            <Tab.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={26} />
                ),
              }}
            />
          </Tab.Navigator>
    )
}

export default TabNav;