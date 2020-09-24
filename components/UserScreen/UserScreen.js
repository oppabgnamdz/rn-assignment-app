import React from 'react'
import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home'
import Settings from './Settings'
import { Ionicons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();

export default function UserScreen({ route }) {
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
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}

            initialRouteName="UserScreen"
            tabBarOptions={{
                activeTintColor: '#e91e63',
                style: {
                    backgroundColor: 'lightblue',
                },
                labelStyle: {
                    fontSize: 20,
                },

            }}
        >
            <Tab.Screen initialParams={{ user: route.params.emailAddress }} name="Home" component={Home} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    )
}
