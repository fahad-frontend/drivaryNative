//import liraries
import React, { useContext, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Modal from "react-native-modal"
import {AuthContext} from '../navigation/AuthProvider'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import { updateUser } from '../utils/Functions'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

// create a component
const AddInfoScreen = ({navigation}) => {

    const {logout, phoneLogin, setLoading, otpTimer, setOtpTimer, user} = useContext(AuthContext)
    const [age, setAge] = useState()
    const [gender, setGender] = useState()
    const [phoneNumber, setPhoneNumber] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [error, setError] = useState(false)
    const [confirm, setConfirm] = useState(null)
    const [code, setCode] = useState()

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.logoutButton} onPress={()=> logout()}>
                <MaterialIcons name='logout' color='#ffffff' size={40} />
            </TouchableOpacity>
            <View style={styles.fillInfo}>
                <Text style={styles.step}>
                    Step 1:
                </Text>
                <Text style={styles.text}>
                    Complete your profile information.
                </Text>
                <FormInput
                    labelValue={age}
                    onChangeText={(newAge) => setAge(newAge)}
                    placeholderText="Age"
                    iconType="user"
                    keyboardType='number-pad'
                />
                <FormInput
                    labelValue={gender}
                    onChangeText={(newGender) => setGender(newGender)}
                    placeholderText="Gender"
                    iconType="skin"
                />
                <FormInput
                    labelValue={phoneNumber}
                    onChangeText={(newNumber) => setPhoneNumber(newNumber)}
                    placeholderText="Phone Number (e.g 3xxxxxxxxx)"
                    prefix='+92'
                    maxLength={10}
                    keyboardType='number-pad'
                />
                {error && <Text style={styles.errorText}>Please fill all fields completely.</Text>}
                {
                    !otpTimer ? <FormButton
                    buttonTitle="Confirm"
                    onPress={async ()=> {
                        if (age && gender && phoneNumber?.length===10){
                            setError(false)
                            setLoading(true)
                            try {
                                const confirmation = await phoneLogin('+92'+phoneNumber)
                                setConfirm(confirmation)
                                setLoading(false)
                                setModalVisible(true)
                                setOtpTimer(true)
                            } catch (error){
                                setLoading(false)
                                Alert.alert(
                                    "Error sending OTP",
                                    `${error}`
                                )
                            }
                        } else {
                            setError(true)
                        }
                    }}
                /> : <Text>Please wait one minute before sending next OTP.</Text>
                }
                    <Modal
                        animationIn='slideInUp'
                        animationOut='slideOutDown'
                        slideOutDown={300}
                        isVisible={modalVisible}
                        onBackButtonPress={() => {
                            setModalVisible(!modalVisible);
                            setCode()
                        }}
                        onBackdropPress	={() => {
                            setModalVisible(!modalVisible);
                            setCode()
                        }}
                    >
                    <View style={styles.modalView}>
                        <FormInput
                            labelValue={code}
                            iconType='checkcircleo'
                            onChangeText={(newCode) => setCode(newCode)}
                            placeholderText="OTP Code"
                            keyboardType='number-pad'
                        />
                        <FormButton
                            buttonTitle="Submit"
                            onPress={async ()=> {
                                try {
                                    setLoading(true)
                                    await confirm.confirm(code)
                                    setModalVisible(false)
                                    setLoading(false)
                                    updateUser({
                                        uid: user.uid,
                                        age,
                                        gender,
                                        phoneNumber,
                                        currentStage: 'LearnersLicense'
                                    })
                                    navigation.replace('LearnersLicense')
                                } catch (error) {                                    
                                    setLoading(false)
                                    Alert.alert(
                                        "Invalid code entered"
                                    )
                                }
                            }} 
                        />
                    </View>
                    </Modal>

            </View>
        </ScrollView>
    )
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2e2c2c',
    },
    logoutButton: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 20,
        marginTop: 40
    },
    text: {
        fontSize: 25,
        color: '#ffffff',
        fontWeight: '900',
        marginBottom: 30
    },
    step: {
        color: '#ffffff',
        fontSize: 20,
        marginBottom: 10
    },
    fillInfo: {
        paddingTop: 25,
        paddingRight: 30,
        paddingLeft: 30
    },
    errorText: {
        color: '#f5625d',
        fontSize: 15,
        fontWeight: '700',
        marginTop: 10
    },
    modalView: {
        backgroundColor: '#2e2c2c',
        paddingRight: 30,
        paddingLeft: 30,
        paddingTop: 50,
        paddingBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0
    },
})

//make this component available to the app
export default AddInfoScreen
