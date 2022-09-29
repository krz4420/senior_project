import React, { useState } from 'react'
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const ResetPasswordScreen = () => {
    const [ code, setCode ] = useState('')
    const [ password, setPassword] = useState('')

    const navigation = useNavigation()

    const onResetPasswordPressed = () => {
        console.warn("reset")
        navigation.navigate('Sign In')
    }

    const onSignIn = () => {
        console.warn("Back to sign in")
        navigation.navigate('Sign In')
    }

    const onNewCode = () => {
        console.warn("Request New Code")
    }

  

    return (
        <ScrollView showsVerticalScrollIndicator = { false }>
            <View style={styles.root}>
                <Text style= {styles.title}>Reset your password</Text>
                <CustomInput placeholder = "Code"  value={ code } setValue= { setCode }/>
                <CustomInput placeholder = "Enter New Password"  value={ password } setValue= { setPassword }/>
                
                <CustomButton text= "Reset Password" onPress= {onResetPasswordPressed} ></CustomButton>

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

export default ResetPasswordScreen