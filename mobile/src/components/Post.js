import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BACKENDPOINT } from '../utils';

const Post = ( { title, description, uri}) => {
    console.log(uri)
    return (
        <View style={styles.container}>
            <Text>{title}</Text>
            {uri ? 
                <Image 
                    style={styles.image}
                    source={{uri:`${BACKENDPOINT}/Post/retrieve/image?name=${uri}`}}
                /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#F9FBFC',
        width:'100%',
        padding: 5,
        borderColor:'#F9FBFC',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        alignContent:'center',
    },
    image:{
        height: 128, 
        width: 128,
        backgroundColor:'grey',
    },
   
});

export default Post;