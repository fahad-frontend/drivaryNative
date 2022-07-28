import React, {useEffect, useState} from 'react'
import { View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import OnboardingScreen from '../screens/OnboardingScreen'
import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// import FontAwesome from 'react-native-vector-icons/FontAwesome'

const AppStack = createStackNavigator()

const AuthStack = () => {
    const [initialRouteName, setInitialRouteName] = useState(null)

    useEffect(()=> {
        AsyncStorage.getItem('alreadyLaunched').then(val=> {
            if (val===null){
                AsyncStorage.setItem('alreadyLaunched', 'true')
                setInitialRouteName('Onboarding')
            } else {
                setInitialRouteName('Login')
            }
        })

        GoogleSignin.configure({
            webClientId: "87909995352-so560hes4ac9o77li13gcodseqt02vqt.apps.googleusercontent.com",
        })
    }, [])

    return (
        initialRouteName && <AppStack.Navigator initialRouteName={initialRouteName} >
            <AppStack.Screen name='Onboarding' component={OnboardingScreen} options={{header: () => null}}/>
            <AppStack.Screen name='Login' component={LoginScreen} options={{header: () => null}}/>
            <AppStack.Screen
                name="Signup"
                component={SignupScreen}
                options={({navigation}) => ({
                    title: '',
                    headerStyle: {
                        backgroundColor: '#f9fafd',
                        shadowColor: '#f9fafd',
                        elevation: 0,
                    },
                    headerLeft: () => (
                        <View style={{marginLeft: 10}}>
                        {/* <FontAwesome.Button 
                            name="long-arrow-left"
                            size={25}
                            backgroundColor="#f9fafd"
                            color="#333"
                            onPress={() => navigation.navigate('Login')}
                        /> */}
                        </View>
                    ),
                    })}
                />
        </AppStack.Navigator>
    )
}

export default AuthStack;