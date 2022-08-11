//import liraries
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import ResourcesScreen from './ResourcesScreen'

// create a component
const ProfileScreen = () => {

    return (
        <View>
            <Text>Profile Screen</Text>
        </View>
    )
}

// define your styles
const styles = StyleSheet.create({

})

//make this component available to the app
export default ProfileScreen;
