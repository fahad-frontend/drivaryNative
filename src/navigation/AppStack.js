//import liraries
import React, { useContext, useEffect, useState } from 'react'
import AddInfoScreen from '../screens/AddInfoScreen'
import LearnersLicenseScreen from '../screens/LearnersLicenseScreen'
import HomeScreen from '../screens/HomeScreen'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthContext } from './AuthProvider'

const Stack = createStackNavigator()

const AppStack = () => {
    const {user} = useContext(AuthContext)

    return (
        <>
            {user?.currentStage && <Stack.Navigator initialRouteName={user?.currentStage}>
                <Stack.Screen name='AddInfo' component={AddInfoScreen} options={{header: () => null}}/>
                <Stack.Screen name='LearnersLicense' component={LearnersLicenseScreen} options={{header: () => null}}/>
                <Stack.Screen name='Home' component={HomeScreen} options={{header: () => null}}/>
            </Stack.Navigator>}
        </>
    )
}

export default AppStack
