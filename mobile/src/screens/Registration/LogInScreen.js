import React, { useState } from 'react'
import { ScrollView, View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native'
import Logo from '../../../assets/icon.png'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import {BACKENDPOINT} from '../../utils';

const LogInScreen = () => {
    const navigation = useNavigation()

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    
    const [ validForm, setValidForm ] = useState(true);

    const onLogInPressed = () => {
        // Extract user info from text input fields
        const userInfo = {username, password};

        // TODO. Scrub data to protect against attacks

        // Ping backend to see if data the user inputted corresponds to a valid account
        axios.post(`${BACKENDPOINT}/LogIn`, userInfo).then(res => {
            console.log(res.data);

            // If no error is returned then the information the user entered corresponds to an account
            navigation.navigate('Home');
        }).catch(err =>{
            error = err.response.data ? err.response.data.message : err.response;
            console.error(error);
            // Set state for valid form to false to render error message
            setValidForm(false);
        });

        // clearState();
    }

    const clearState = () => {
        setUsername('');
        setPassword('');
        setValidForm(true)
    }

    const onForgotPasswordPressed = () => {

        clearState();
        navigation.navigate('Forgot Password');
    }

    // const onGoogleSignIn = () => {
    //     console.warn("Google Sign In attemp")
    // }

    const onSignUp = () => {
        console.warn("Sign Up");

        clearState();
        navigation.navigate('Sign Up');
    }

    const { height } = useWindowDimensions();
    return (
        <ScrollView showsVerticalScrollIndicator = { false }>
            <View style={styles.root}>
                <Image 
                    source = {Logo} 
                    style ={[styles.logo, {height: height * 0.3}]} 
                    resizeMode="contain"/>

                {validForm ? null: 
                    <Text style={styles.error}>Invalid Login Credentials!</Text>}

                <CustomInput 
                    placeholder = "Username"  
                    value={ username} 
                    setValue= {setUsername}
                    autoCapitalize= {false}
                    onFocus = {setValidForm}
                    />
                <CustomInput 
                    placeholder = "Password" 
                    value = {password} 
                    setValue = {setPassword} 
                    secureTextEntry
                    autoCapitalize={false}
                    onFocus = {setValidForm}
                    />
                <CustomButton 
                    text= "Log In" 
                    onPress= {onLogInPressed} />

                <CustomButton 
                    text= "Forgot Password?" 
                    onPress= {onForgotPasswordPressed} 
                    type="TERTIARY"/>

                {/* <CustomButton 
                    text= "Sign In with Google" 
                    onPress= {onGoogleSignIn} 
                    type="TERTIARY" 
                    bgColor='#FAE9EA' 
                    fgColor='#DD4D44'/> */}

                <CustomButton 
                    text= "Don't have an account? Sign up!" 
                    onPress= {onSignUp} 
                    type="TERTIARY" />
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 20,
        backgroundColor:'rgba(10, 39, 103, 0.2)'
    },
    logo:{
        width:'30%',
        maxWidth: 500,
        maxHeight: 200,
    },
    error:{
        color:'red',
        borderColor:'red',
    }
});

export default LogInScreen;