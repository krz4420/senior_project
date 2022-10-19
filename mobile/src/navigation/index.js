import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuth } from '../context/Auth';

const Navigation = () => {
    const {authData } = useAuth();
    return(
        <NavigationContainer>
            {authData ? <AppStack/> : <AuthStack />}
        </NavigationContainer>
            
      
    );
};

export default Navigation;