import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogInScreen from '../screens/Registration/LogInScreen';
import SignUpScreen from '../screens/Registration/SignUpScreen';
import ConfirmEmailScreen from '../screens/Registration/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/Registration/ForgotPasswordScreeen';
import ResetPasswordScreen from '../screens/Registration/ResetPasswordScreen';
import HomeScreen from './HomeScreen'

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Group>
                    <Stack.Screen name="Log In" component= {LogInScreen} />
                    <Stack.Screen name="Sign Up" component= {SignUpScreen} />
                    <Stack.Screen name="Confirm Email" component= {ConfirmEmailScreen} />
                    <Stack.Screen name="Forgot Password" component= {ForgotPasswordScreen} />
                    <Stack.Screen name="Reset Password" component= {ResetPasswordScreen} />
                </Stack.Group>
                <Stack.Group>
                    <Stack.Screen name="Home" component= {HomeScreen} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
            
      
    );
};

export default Navigation;