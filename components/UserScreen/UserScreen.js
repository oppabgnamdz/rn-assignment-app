import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home'
import Settings from './Settings'
import { Ionicons, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase'
const Tab = createBottomTabNavigator();


export default function UserScreen({ route, navigation }) {
    const expoPushToken = route.params.expoPushToken
    const [check, setCheck] = useState(true);
    console.log(expoPushToken + "userCreen")
    useEffect(() => {
        async function render() {
            const db = firebase.firestore()
            await db.collection("notifications").where("listDevice", "array-contains", expoPushToken)
                .get()
                .then(function (query) {
                    query.forEach(function (doc) {
                        setCheck(false);
                        console.log(check)
                        // db.collection("notifications").doc("device").update({
                        //     listDevice: firebase.firestore.FieldValue.arrayUnion(expoPushToken)
                        // })
                    })
                })
            if (check) {
                console.log('follow')
                navigation.setOptions({
                    headerRight: () => (
                        <TouchableOpacity
                            style={{
                                marginRight: 20,
                                backgroundColor: 'white',
                                borderRadius: 100,
                                padding: 10
                            }}
                            onPress={

                                async () => {
                                    var update = await db.collection("notifications").doc("device").update({
                                        listDevice: firebase.firestore.FieldValue.arrayUnion(expoPushToken)
                                    })
                                    alert("Đã theo dõi")
                                    setCheck(false)
                                }}
                        >
                            <SimpleLineIcons name="user-follow" size={24} color="gray" />
                        </TouchableOpacity >
                    ),
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{
                                marginLeft: 7,
                                backgroundColor: 'white',
                                borderRadius: 100,
                                padding: 10
                            }}
                            onPress={() => {
                                navigation.navigate('Login')
                            }}
                        >
                            <AntDesign name="back" size={24} color="black" />
                        </TouchableOpacity>
                    ),

                })

            } else {
                console.log('unfollow')
                navigation.setOptions({
                    headerRight: () => (
                        <TouchableOpacity
                            style={{
                                marginRight: 20,
                                backgroundColor: 'white',
                                borderRadius: 100,
                                padding: 10
                            }}
                            onPress={

                                async () => {
                                    var update = await db.collection("notifications").doc("device").update({
                                        listDevice: firebase.firestore.FieldValue.arrayRemove(expoPushToken)
                                    })
                                    alert("Đã bỏ theo dõi")
                                    setCheck(true)
                                }}
                        >
                            <SimpleLineIcons name="user-unfollow" size={24} color="black" />
                        </TouchableOpacity >
                    ),
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{
                                marginLeft: 7,
                                backgroundColor: 'white',
                                borderRadius: 100,
                                padding: 10
                            }}
                            onPress={() => {
                                navigation.navigate('Login')
                            }}
                        >
                            <AntDesign name="back" size={24} color="black" />
                        </TouchableOpacity>
                    ),

                })
            }
        }
        render();

    }, [check])
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'ios-home' : 'md-home';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'ios-person' : 'md-person';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}


            initialRouteName="Home"
            tabBarOptions={{
                activeTintColor: '#e91e63',
                style: {
                    backgroundColor: 'lightblue',
                },
                labelStyle: {
                    fontSize: 13,
                },

            }}
        >
            <Tab.Screen initialParams={{ user: route.params.emailAddress }} name="Home" component={Home} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    )
}

async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}


