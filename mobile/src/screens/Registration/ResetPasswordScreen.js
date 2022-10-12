import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import {BACKENDPOINT} from '../../utils';

const ResetPasswordScreen = ({route}) => {
    const [ code, setCode ] = useState('');
    const [ password, setPassword] = useState('');
    const [ validFrom, setValidForm ] = useState(true);
    const [ validPass, setValidPass ] = useState(true);

    const navigation = useNavigation()

    useEffect (()=>{
        const { email } = route.params;
        axios.post(`${BACKENDPOINT}/ResetPassword/generateCode`, {email}).catch(err => {
            error = error.response.data.message;
            setValidForm(false);
        })
    },[]);

    const onResetPasswordPressed = () => {
       
        console.warn("reset");
        if(password.length < 4){
            setValidPass(false);
            console.log("Error with password");
            return;
        }
        
        const { username, email } = route.params;
        axios.post(`${BACKENDPOINT}/ResetPassword/confirmReset`, {code, password, username, email } ).then(res => {
            console.log("IN here on reset")
            console.log(res.data);

            // If no error is returned then the information the user entered corresponds to an account
            navigation.navigate('Log In');
        }).catch(err =>{
            error = err.response.data.message ? err.response.data.message : err.response;
            console.error(error);
            // Set state for valid form to false to render error message
            setValidForm(false);
        });
        console.log('DOne');
    }

    const onLogIn = () => {
        console.warn("Back to sign in")
        navigation.navigate('Log In')
    }

    const onNewCode = () => {
        console.warn("Request New Code")
    }


    return (
        <ScrollView showsVerticalScrollIndicator = { false }>
            <View style={styles.root}>
                <Text style= {styles.title}>Reset your password</Text>

                {validFrom ? null: <Text style={styles.error}>Incorrect Code</Text>}

                <CustomInput 
                    placeholder = "Code"  
                    value={ code } 
                    setValue= { setCode } 
                    onFocus = { setValidForm }
                    autoCapitalize = {false} 
                    />

                <CustomInput 
                    placeholder = "Enter New Password"  
                    value={ password } 
                    setValue= { setPassword } 
                    onFocus = { setValidPass }
                    autoCapitalize = {false} 
                    />

                { validPass ? null: <Text style={styles.error}>Password must be at least 8 characters long!</Text>}

                <CustomButton 
                    text= "Reset Password" 
                    onPress= { onResetPasswordPressed } 
                />

                <CustomButton 
                    text= "Back to Sign In"
                    onPress= { onLogIn } 
                    type="TERTIARY" 
                />
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
    },
    error:{
        color:'red',
    }
});

export default ResetPasswordScreen;