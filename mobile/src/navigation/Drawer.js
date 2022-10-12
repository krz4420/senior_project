import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNav from './Tab';
import JoinGroupScreen from '../screens/LandingPage/JoinGroupScreen';
import CreateGroupScreen from '../screens/LandingPage/CreateGroupScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const Drawer = createDrawerNavigator();

const DrawNav = () => {
  return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen 
            name="Group1" 
            component={TabNav}
            options={{
                drawerLabel: 'Group1',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="select-group" color={color} size={20} />
                ),
              }}
            />
        <Drawer.Screen name="Group2" component={TabNav} options={{
                drawerLabel: 'Group2',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="select-group" color={color} size={20} />
                ),
              }}/>
        <Drawer.Screen name="Group3" component={TabNav} options={{
                drawerLabel: 'Group3',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="select-group" color={color} size={20} />
                ),
              }}/>
        <Drawer.Screen name="Join Group" component={JoinGroupScreen} options={{
                drawerLabel: 'Join Group',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account-group" color={color} size={20} />
                ),
              }}/>
        <Drawer.Screen name="Create Group" component={CreateGroupScreen} options={{
                drawerLabel: 'Create Group',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="plus-circle" color={color} size={20} />
                ),
              }}/>


        
      </Drawer.Navigator>
  );
}

export default DrawNav;