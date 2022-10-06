import React from 'react'
import { View, Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


import LogInScreen from '../screens/LogInScreen'
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreeen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import HomeScreen from '../screens/HomeScreen'

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return(
        <NavigationContainer>
           <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Log In" component= {LogInScreen} />
            <Stack.Screen name="Sign Up" component= {SignUpScreen} />
            <Stack.Screen name="Confirm Email" component= {ConfirmEmailScreen} />
            <Stack.Screen name="Forgot Password" component= {ForgotPasswordScreen} />
            <Stack.Screen name="Reset Password" component= {ResetPasswordScreen} />
            <Stack.Screen name="Home" component= {HomeScreen} />
           </Stack.Navigator>
        </NavigationContainer>
            
      
    );
};

export default Navigation;