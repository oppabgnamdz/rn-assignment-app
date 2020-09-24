import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Keyboard, YellowBox } from 'react-native';
import Login from './components/Login';
import FirebaseConfig from './components/ConfigFirebase'
import * as firebase from 'firebase'
import Post from './components/Post'
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import ListPost from './components/ListPost'
import Home from './components/UserScreen/Home'
import UserScreen from './components/UserScreen/UserScreen'
FirebaseConfig
const Stack = createStackNavigator();
export default function App() {
  YellowBox.ignoreWarnings(['Setting a timer']);
  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ title: 'Đăng nhập', gestureEnabled: false }} />
        <Stack.Screen name="Post" component={Post} options={{ title: '', gestureEnabled: false, headerLeft: () => { } }} />
        <Stack.Screen name="ListPost" component={ListPost} options={{ title: 'DashBoard', gestureEnabled: false }} />
        <Stack.Screen name="UserScreen" component={UserScreen} options={{ title: 'UserScreen', gestureEnabled: false, headerLeft: () => { } }} />
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
