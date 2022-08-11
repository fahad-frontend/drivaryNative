//import liraries
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import ResourcesScreen from './ResourcesScreen'
import LessonProgressScreen from './LessonProgressScreen'

// create a component
const Tab = createMaterialTopTabNavigator()

const HomeScreen = () => {

    return (
        <Tab.Navigator
            initialRouteName={LessonProgressScreen}
            tabBarPosition='bottom'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    if (route.name === 'Lessons') {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (route.name === 'Resources') {
                        iconName = focused ? 'reader' : 'reader-outline'
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline'
                    }
                    return <Ionicons name={iconName} size={20} color='#ffffff' />;
                },
                tabBarLabelStyle: { color: '#ffffff' },
                tabBarStyle: { backgroundColor: '#FF8C88' },
                tabBarIndicatorStyle: { backgroundColor: '#ffffff' , height: 5}
            })}
            >
            <Tab.Screen name={'Lessons'} component={LessonProgressScreen} />
            <Tab.Screen name={'Resources'} component={ResourcesScreen} />

        </Tab.Navigator>
    )
}

// define your styles
const styles = StyleSheet.create({

})

//make this component available to the app
export default HomeScreen;
