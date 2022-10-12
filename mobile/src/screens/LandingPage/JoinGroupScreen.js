import React, {useState} from 'react'
import { ScrollView, View, Text, Image, StyleSheet, Keyboard } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';


const JoinGroupScreen = () => {
    const [groupId, setGroupId] = useState('');
    const [ isValidId, setValidId ] = useState(true);

    const onSubmitPressed = () => {
        if(!isValidId){
            return;
        }else{
            // Check if the group id is valid
        }
    }

    const handleValidGroupId = (e) => {
        if(e.length < 4){
            setValidId(false)
        }else{
            setValidId(true);
        }
    }

    return (
        <ScrollView showsVerticalScrollIndicator = { false }>
            <View style={styles.root}>
                <Text style= {styles.title}>Add Group</Text>

                <CustomInput 
                    placeholder = "Enter Group ID"  
                    value={ groupId } 
                    setValue= { setGroupId } 
                    autoCapitalize={false} 
                    onEndEditing={(e)=>handleValidGroupId(e.nativeEvent.text)} 
                />

                {isValidId ? null : <Text style={styles.error}>Group ID Must be at least 4 characters</Text>}
                <CustomButton 
                    text= "Submit" 
                    onPress= {onSubmitPressed}
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

export default JoinGroupScreen;