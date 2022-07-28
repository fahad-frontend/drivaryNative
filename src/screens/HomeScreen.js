//import liraries
import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FormButton from '../components/FormButton'
import {AuthContext} from '../navigation/AuthProvider'

// create a component
const HomeScreen = () => {

    const {user, logout} = useContext(AuthContext)

    return (
        <View style={styles.container}>
            <Text>Welcome {user.uid}</Text>
            <FormButton buttonTitle='Logout' onPress={()=> logout()} />
        </View>
    )
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

//make this component available to the app
export default HomeScreen