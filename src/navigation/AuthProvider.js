import React, {createContext, useState, useEffect} from "react"
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'
import { Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [otpTimer, setOtpTimer] = useState(false)

    useEffect(()=> {
        if (otpTimer){
            setTimeout(()=> {
                setOtpTimer(false)
            }, 10000)
        }
    }, [otpTimer])

    return ( 
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                otpTimer,
                setOtpTimer,
                login: async (email, password) => {
                    try{
                        setLoading(true)
                        const profile = await auth().signInWithEmailAndPassword(email, password)
                        const existingUser = await firestore().collection('Users').doc(profile?.user?.uid).get()
                        setUser(prev=> ({...prev, ...existingUser?._data}))
                        setLoading(false)
                    } catch (error){
                        setLoading(false)
                        Alert.alert(
                            "Error logging in",
                            "Invalid email or password provided."
                        )
                    }
                },
                googleLogin: async () => {
                    try {
                        setLoading(true)
                        // Get the users ID token
                        GoogleSignin.configure({
                            webClientId: "87909995352-so560hes4ac9o77li13gcodseqt02vqt.apps.googleusercontent.com",
                        })
                        const { idToken } = await GoogleSignin.signIn()

                        // Create a Google credential with the token
                        const googleCredential = auth.GoogleAuthProvider.credential(idToken)
                        
                        // Sign-in the user with the credential
                        const profile = await auth().signInWithCredential(googleCredential)
                        const existingUser = await firestore().collection('Users').doc(profile?.user?.uid).get()
                        setUser(prev=> ({...prev, ...existingUser?._data}))
                        setLoading(false)
                    } catch (error){
                        setLoading(false)
                        Alert.alert(
                            "Error logging in",
                            "Invalid google email or password provided."
                        )
                    }
                },
                facebookLogin: async () => {
                    try {
                        setLoading(true)
                        // Attempt login with permissions
                        const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])

                        if (result.isCancelled) {
                            throw 'User cancelled the login process'
                        }

                        // Once signed in, get the users AccesToken
                        const data = await AccessToken.getCurrentAccessToken()

                        if (!data) {
                            throw 'Something went wrong obtaining access token'
                        }

                        // Create a Firebase credential with the AccessToken
                        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken)

                        // Sign-in the user with the credential
                        const profile = await auth().signInWithCredential(facebookCredential)
                        const existingUser = await firestore().collection('Users').doc(profile?.user?.uid).get()
                        setUser(prev=> ({...prev, ...existingUser?._data}))
                        setLoading(false)
                    } catch (error){
                        setLoading(false)
                        Alert.alert(
                            "Error logging in",
                            "Invalid facebook email or password provided."
                        )
                    }
                },
                phoneLogin: async (phoneNumber) => {
                    try {
                        return await auth().signInWithPhoneNumber(phoneNumber)
                    }catch(error){
                        console.log(error)
                    }
                },
                register: async (email, password) => {
                    try{
                        setLoading(true)
                        await auth().createUserWithEmailAndPassword(email, password)
                        setLoading(false)
                    } catch (error){
                        console.log(error)
                        setLoading(false)
                        Alert.alert(
                            "Error registering account",
                            `${error}`
                        )
                    }
                },
                logout: async () => {
                    try{
                        setLoading(true)
                        setUser(null)
                        await auth().signOut()
                        setLoading(false)
                    } catch (error){
                        setLoading(false)
                        Alert.alert(
                            "Error logging out",
                            "An error occured while logging out of your account."
                        )
                    }
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}