import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Keyboard } from 'react-native';
import Login from './components/Login';
import FirebaseConfig from './components/ConfigFirebase'
import * as firebase from 'firebase'
import Post from './components/Post'
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import ListPost from './components/ListPost'
FirebaseConfig
const Stack = createStackNavigator();
export default function App() {

  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ title: 'Đăng nhập' }} />
        <Stack.Screen name="Post" component={Post} options={{ title: '', headerLeft: () => { } }} />
        <Stack.Screen name="ListPost" component={ListPost} options={{ title: 'DashBoard', headerLeft: () => { } }} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
