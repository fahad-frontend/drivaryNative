//import liraries
import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

// create a component
const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen} />
        </Stack.Navigator>
    )
}

//make this component available to the app
export default AppStack;
