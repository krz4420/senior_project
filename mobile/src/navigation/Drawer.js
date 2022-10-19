import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNav from './Tab';
import JoinGroupScreen from '../screens/LandingPage/JoinGroupScreen';
import CreateGroupScreen from '../screens/LandingPage/CreateGroupScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/Auth';



const Drawer = createDrawerNavigator();

const DrawNav = () => {
  const auth = useAuth();
  const group = auth.authData.groups;

  const list = group.map((groupName) => <Drawer.Screen name={groupName} component={TabNav} options={{
    drawerIcon: ({ color }) => (
      <MaterialCommunityIcons name="select-group" color={color} size={20} />
    ),
  }}/>)

  return (
      <Drawer.Navigator initialRouteName="Home">
        {list}    
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