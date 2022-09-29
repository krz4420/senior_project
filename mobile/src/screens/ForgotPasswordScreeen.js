import React, { useState } from 'react'
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const ForgotPasswordScreen = () => {
    const [ username, setUsername ] = useState('')
    const navigation = useNavigation()


    const onSendPressed = () => {
        console.warn("Send")

        navigation.navigate('Reset Password')
    }

    const onSignIn = () => {
        console.warn("Back to sign in")
        navigation.navigate('Sign In')
    }

  

    return (
        <ScrollView showsVerticalScrollIndicator = { false }>
            <View style={styles.root}>
                <Text style= {styles.title}>Forgot your password?</Text>
                <CustomInput placeholder = "Enter Username"  value={ username } setValue= { setUsername }/>
                
                <CustomButton text= "Submit" onPress= {onSendPressed} ></CustomButton>

                <CustomButton text= "Back to Sign In" onPress= {onSignIn} type="TERTIARY" ></CustomButton>
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

export default ForgotPasswordScreen