import React, {useState} from 'react'
import { View, ScrollView, Text, Button, Image, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import {useAuth} from '../../context/Auth';
import {BACKENDPOINT} from '../../utils';

const CreatePostScreen = ( props ) => {
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ media, setMedia ] = useState([]);
    const [ validForm, setValidForm ] = useState(true);

    const auth = useAuth();

    const pickImage = async () => {
        setValidForm(true);
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          setMedia([...media, {uri:result.uri, type:result.type, name: result.fileName}]);
        }
      };
    
    const onCreatePost = () => {

        if(isFormEmpty()){
            setValidForm(false);
            return;
        }

        console.log(props.route.params.groupName);
        let bodyData = new FormData();

        bodyData.append('file', {
            name: media[0].name == null ? 'image' : media[0].name,
            uri: media[0].uri,
            type: media[0].type,
        })

        console.log(bodyData._parts);

        axios.post(`${BACKENDPOINT}/Post/create/image`, bodyData, {
            headers:{
                'accept':'application/json',
                'Content-Type':`multipart/form-data; boundary=${bodyData._boundary}`,
            }
        }).then(res => {
            console.warn(res);
            const postData = {
                title,
                user: auth.authData.username,
                group: props.route.params.groupName,
                filename: res.data.filename,
            }
            createPost(postData);
        }).catch(error => {
            console.error(error);
        })

        // media.forEach(file => {
        //    data.append("file", {
        //     uri:file.uri,
        //     type:file.type,
        //     name:file.fileName,
        //    })
        // })
        
         
        // axios.post(`${BACKENDPOINT}/CreatePost`, bodyData).then(res => {
        //     console.log(res);
        // }).catch(error => {
        //     console.error(error);
        // });
    }

    const createPost = async (postData) => {
        await axios.post(`${BACKENDPOINT}/Post/create/post`, postData).then( res => {
            console.log(res.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const isFormEmpty = () => {
        const userData = [title, description];
        
        if(Object.values(userData).every(val => val.length == 0) || media.length == 0){
            return true;
        }else{
            return false;
        }
    };
    

    return(
        <ScrollView style = {styles.root}>
            <Text style = {styles.title}>Create Post for {props.route.params.groupName}</Text>
            {validForm ? null: 
                    <Text style={styles.error}>Please enter a title, description and select an image/video!</Text>}
            <CustomInput 
                    placeholder = "Title" 
                    value = {title} 
                    setValue = {setTitle} 
                    autoCapitalize={false}
                    onFocus = {setValidForm}
                    />

            <CustomInput 
                    placeholder = "Description" 
                    value = {description} 
                    setValue = {setDescription} 
                    autoCapitalize={false}
                    onFocus = {setValidForm}
                    />
            <Button title="Pick images or videos from your camera roll" onPress={pickImage} />
            <View style = {styles.imageContainer }>
                {media.map( file => <Image key = {file.uri} source={{ uri: file.uri }} style={styles.image}/>)}
            </View>
            <CustomButton text="Create Post" onPress={onCreatePost} />
                
        </ScrollView>
      
    )
}

const styles = StyleSheet.create({
    root:{
        padding: 20,
    },
    imageContainer: {
       flexDirection:'row',
       flexWrap:'wrap',
       justifyContent:'center',
    },
    image : {
        width: 170, 
        height: 170,
        marginBottom: 10,
        marginHorizontal: 10,
        
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        margin:10,
        color:'#051c60'
     },
     error:{
        color:'red',
        borderColor:'red',
    }
})

export default CreatePostScreen;