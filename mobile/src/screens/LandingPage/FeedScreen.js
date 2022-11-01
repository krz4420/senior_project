import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ScrollView, Text} from 'react-native'
import { BACKENDPOINT } from '../../utils';
import Post from '../../components/Post';
import Video from 'react-native-video';

const FeedScreen = ( props ) => {
    const [ postsData, setPostsData ] = useState([]);
    const isFocused = useIsFocused();

    const fetchFeed = () => {
        axios.get(`${BACKENDPOINT}/Post/retrieve/post?group=${props.route.params.groupName}`).then(  res =>{
            console.log( postsData )
            
            setPostsData(res.data);
            
            console.log( postsData )
        }).catch( err => {
            console.error("Could not fetch posts. Please try again.");
        })
    }

    useEffect( () => {
        if(isFocused){
            fetchFeed();
        }
       
    }, [isFocused])

    const posts = postsData.map(post => {
        return(
        <Post key = {post._id} title = {post.title} uri = {post.filename}/> 
        )
    })
    return(
        <ScrollView>
            <Text>Feed for {props.route.params.groupName}</Text>
            {posts}
            
        </ScrollView>
      
    )
}

export default FeedScreen;