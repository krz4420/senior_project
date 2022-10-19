import React from 'react'
import { View, Text} from 'react-native'
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/Auth';


const ProfileScreen = () => {
    const auth = useAuth();
    return(
        <View>
            <Text>{auth.authData.username}</Text>
            <CustomButton text="Sign Out" onPress={auth.signOut}/>
        </View>
      
    )
}

export default ProfileScreen;