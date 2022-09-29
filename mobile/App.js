import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import axios from 'axios';
import {useEffect} from 'react'

import Navigation from './src/navigation';

const baseUrl = ' http://fefd-2601-18b-8000-54e0-9919-b653-f3e4-4f7a.ngrok.io'
const localIp = 'http://10.0.0.139:4000'


export default function App() {

  const getData = async () => {
      axios.get(`${localIp}/doggo`).then(res =>{
        console.log(res)
      }).catch((error) => {
        console.log(error.toJSON())
      })   
  }

  const postData = async () => {
    axios.post(`${localIp}/doggo`, {
      name: 'Post Malone',
      age: 15,
    }).then(function(response){
      console.log(response)
    }).catch(function(error){
      console.log(error.toJSON())
    })
      
}

  

  useEffect(() => {
    // getData()
    // postData()
    // getData()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC',
    
  },
});
