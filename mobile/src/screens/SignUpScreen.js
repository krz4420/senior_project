import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ repeatPassword, setRepeatPassword ] = useState('')
    const [ password, setPassword ] = useState('')

    const navigation = useNavigation()

    const onSignUpPressed = () => {
        console.warn("Sign In")

        navigation.navigate('Confirm Email')
    }

    const onSignIn = () => {
        console.warn("Sign Up")

        navigation.navigate('Sign In')
    }

    const onPrivacyPress = () => {
        console.warn("Privacy Press")
        
        navigation.navigate('Privacy')
    }

    const onTermsPress = () => {
        console.warn("Terms Press")
        navigation.navigate('Terms')
    }

    return (
        <ScrollView showsVerticalScrollIndicator = { false }>
            <View style={styles.root}>
                <Text style= {styles.title}>Create an Account!</Text>
                <CustomInput placeholder = "Username"  value={ username} setValue= {setUsername}/>
                <CustomInput placeholder = "Email"  value= { email } setValue= {setEmail}/>
                <CustomInput placeholder = "Password" value = {password} setValue = {setPassword} secureTextEntry/>
                <CustomInput placeholder = "Re-enter Password" value = {repeatPassword} setValue = {setRepeatPassword} secureTextEntry/>

                <CustomButton text= "Sign Up" onPress= {onSignUpPressed} ></CustomButton>

                <Text style={styles.text}>By Registering, you confirm that you accept our { }
                <Text style={styles.link} onPress={onTermsPress}>Terms of Use</Text> and { }
                <Text style={styles.link} onPress = {onPrivacyPress}>Privacy Policy</Text>
                </Text>

                <CustomButton text= "Have an account? Sign In!" onPress= {onSignIn} type="TERTIARY" ></CustomButton>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 20,
    },
    title:{
       fontSize: 24,
       fontWeight: 'bold',
       margin:10,
       color:'#051c60'
    },
    text:{
        color:'gray',
        marginVertical: 10,
    },
    link:{
        color:'#FdB075'
    }
});

export default SignUpScreen