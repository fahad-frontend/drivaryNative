import React, {useContext, useState, useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import {AuthContext} from './AuthProvider'
import { addUser } from '../utils/Functions'
import Spinner from 'react-native-loading-spinner-overlay'
import firestore from '@react-native-firebase/firestore'

import AuthStack from './AuthStack'
import AppStack from './AppStack'

const Routes = () => {

    const {user, setUser, loading, setLoading} = useContext(AuthContext)
    const [authDone, setAuthDone] = useState(false)

    // console.log(user)
    const onAuthStateChanged = async (authUser) => {
        if (authUser?.uid){
            let updatedUserObject = JSON.parse(JSON.stringify(authUser))
            setAuthDone(true)
            if (updatedUserObject?.uid && !updatedUserObject?.currentStage){
                const queryResult = await firestore().collection('Users').doc(updatedUserObject?.uid).get()
                if (queryResult?._data){ 
                    // when user signs in using Google or Facebook, we update local user object with document from firebase which has the user's display name as well  
                    updatedUserObject = queryResult?._data
                }
            }
            setUser(prev=> ({...updatedUserObject, displayName: updatedUserObject?.displayName || prev?.displayName}))
        } else {
            setUser(null)
        }
    }

    useEffect(()=> {
        if(user?.uid && user?.displayName && authDone){
            addUser(user) // create or update user object in firebase
            setAuthDone(false)
        }
    }, [user])

    useEffect(()=> {
        setLoading(true)
        setTimeout(()=> {
            setLoading(false)
        }, 3000)
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, [])

    return ( 
        <NavigationContainer>
            <Spinner visible={loading} color='#FF8C88'/>
            {((user?.uid || user?._id) && user?.displayName) ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    )
}

export default Routes