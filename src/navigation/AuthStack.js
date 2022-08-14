import React, {useEffect, useState} from 'react'
import { View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import OnboardingScreen from '../screens/OnboardingScreen'
import SocialLoginScreen from '../screens/SocialLoginScreen'
import SignupScreen from '../screens/SignupScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const AuthStackNavigator = createStackNavigator()

const AuthStack = () => {
    const [initialRouteName, setInitialRouteName] = useState(null)

    useEffect(()=> {
        AsyncStorage.getItem('alreadyLaunched').then(val=> {
            if (val===null){
                AsyncStorage.setItem('alreadyLaunched', 'true')
                setInitialRouteName('Onboarding')
            } else {
                setInitialRouteName('SocialLogin')
            }
        })
    }, [])

    return (
        initialRouteName && <AuthStackNavigator.Navigator initialRouteName={initialRouteName} >
            <AuthStackNavigator.Screen name='Onboarding' component={OnboardingScreen} options={{header: () => null}}/>
            <AuthStackNavigator.Screen name='SocialLogin' component={SocialLoginScreen} options={{header: () => null}}/>
            <AuthStackNavigator.Screen
                name="Signup"
                component={SignupScreen}
                options={({navigation}) => ({
                    title: '',
                    headerStyle: {
                        backgroundColor: '#FEEBD6',
                        elevation: 0,
                    },
                    headerLeft: () => (
                        <View style={{marginLeft: 10}}>
                            <FontAwesome.Button 
                                name="long-arrow-left"
                                size={35}
                                backgroundColor="#FEEBD6"
                                color="#FF8C88"
                                onPress={() => navigation.navigate('SocialLogin')}
                            />
                        </View>
                    ),
                    })}
                />
        </AuthStackNavigator.Navigator>
    )
}

export default AuthStack;