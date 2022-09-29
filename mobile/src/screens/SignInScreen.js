import React, { useState } from 'react'
import { ScrollView, View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native'
import Logo from '../../assets/favicon.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const SignInScreen = () => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState("")

    const navigation = useNavigation()

    const onSignInPressed = () => {
        console.warn("Sign In")
        // Validate TODO
        axios.post('http://10.0.0.139:4000/LogIn').then(res => {
            
        })

        navigation.navigate('Home')
    }

    const onForgotPasswordPressed = () => {
        console.warn("Forgor")

        navigation.navigate('Forgot Password')
    }

    const onGoogleSignIn = () => {
        console.warn("Google Sign In attemp")
    }

    const onSignUp = () => {
        console.warn("Sign Up")

        navigation.navigate('Sign Up')
    }

    const { height } = useWindowDimensions();
    return (
        <ScrollView showsVerticalScrollIndicator = { false }>
            <View style={styles.root}>
                <Image 
                    source = {Logo} 
                    style ={[styles.logo, {height: height * 0.3}]} 
                    resizeMode="contain"/>

                <CustomInput 
                    placeholder = "Username"  
                    value={ username} 
                    setValue= {setUsername}/>

                <CustomInput 
                    placeholder = "Password" 
                    value = {password} 
                    setValue = {setPassword} 
                    secureTextEntry/>

                <CustomButton 
                    text= "Sign In" 
                    onPress= {onSignInPressed} />

                <CustomButton 
                    text= "Forgot Password?" 
                    onPress= {onForgotPasswordPressed} 
                    type="TERTIARY"/>

                <CustomButton 
                    text= "Sign In with Google" 
                    onPress= {onGoogleSignIn} 
                    type="TERTIARY" 
                    bgColor='#FAE9EA' 
                    fgColor='#DD4D44'/>

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
    },
    logo:{
        width:'30%',
        maxWidth: 500,
        maxHeight: 200,
    }
});

export default SignInScreen