//import liraries
import React, { useContext, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native'
import Modal from "react-native-modal"
import {AuthContext} from '../navigation/AuthProvider'
import ImagePicker from 'react-native-image-crop-picker'
import FormButton from '../components/FormButton'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Calendar } from 'react-native-calendars'
import { windowHeight } from '../utils/Dimensions'
import { updateUser } from '../utils/Functions'
import storage from '@react-native-firebase/storage'
import moment from 'moment'

const LearnersLicenseScreen = ({navigation}) => {

    const {logout, user} = useContext(AuthContext)
    const [day, setDay] = useState()
    const [slot, setSlot] = useState('')
    const [image, setImage] = useState(null)
    const [transferred, setTransferred] = useState(0)
    const [photoModalVisible, setPhotoModalVisible] = useState(false)
    const [timeModalVisible, setTimeModalVisible] = useState(false)
    const [proceedModalVisible, setProceedModalVisible] = useState(false)
    const [uploadResult, setUploadResult] = useState('')
    const [error, setError] = useState(false)
    const disabledDays = [1, 2, 3, 4]
    const slots = [
        '9 am to 11 am',
        '11 am to 1 pm',
        '1 pm to 3 pm',
        '3 pm to 5 pm',
    ]
    const getDaysInMonth = (month, year, days) => {
        let pivot = moment().month(month).year(year).startOf('month')
        const end = moment().month(month).year(year).endOf('month')
    
        let dates = {}
        const disabled = { disabled: true, disableTouchEvent: true }
        while(pivot.isBefore(end)) {
            days.forEach((day) => {
                const copy = moment(pivot);
                dates[copy.day(day).format("YYYY-MM-DD")] = disabled
            })
            pivot.add(7, 'days')
        }
        return dates
    }

    const uploadImage = async () => {
        const uploadUrl = Platform.OS==='ios' ? image.sourceURL : image.path
        setTransferred(0)
        setProceedModalVisible(true)
        const storageRef = storage().ref(user?._id+'_paymentProof')
        const task = storageRef.putFile(uploadUrl)
        task.on('state_changed', taskSnapshot => {
            setTransferred(Math.round(taskSnapshot.bytesTransferred*100/taskSnapshot.totalBytes))
        })
        try{
            await task
            setUploadResult('success')
            const downloadUrl = await storageRef.getDownloadURL()
            updateUser({
                _id: user?._id || user?.uid,
                learnersDate: day?.timestamp,
                learnersSlot: slot,
                learnersPaymentImage: downloadUrl,
                currentStage: 'Home'
            })
        } catch (error){
            console.log(error)
            setUploadResult('failure')
        }
    }

    const [markedDates, setMarkedDates] = useState(getDaysInMonth(moment().month(), moment().year(),  disabledDays))

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.logoutButton} onPress={()=> logout()}>
                <MaterialIcons name='logout' color='#111111' size={40} />
            </TouchableOpacity>
            <View style={styles.fillInfo}>
                <Text style={styles.step}>
                    Step 2:
                </Text>
                <Text style={styles.text}>
                    Book learner's license appointment.
                </Text>
                <View style={styles.calendarView}>
                    <Text style={styles.mediumText}>Select date and time slot.</Text>
                    <Calendar
                        key='calendar' 
                        theme={{
                            todayTextColor: '#FF8C88',
                            arrowColor: '#FF8C88'
                        }} 
                        onDayPress={selectedDay=> {
                            day?.timestamp !== selectedDay?.timestamp && setSlot('')
                            setDay(selectedDay)
                            setTimeModalVisible(true)
                        }}
                        markedDates={day ? {
                            ...markedDates,
                            [day.dateString]: {selected: true, selectedColor: '#FF8C88'}
                        } : {...markedDates}}
                        onMonthChange={(date) => {
                            setMarkedDates(getDaysInMonth(date.month - 1, date.year, disabledDays))
                        }}
                        enableSwipeMonths={true}
                    />
                </View>
                {day && slot && <View style={styles.imageView}>
                    <Text style={styles.mediumText}>{image ? 'Payment Receipt: ' : 'Please upload payment receipt to confirm booking.'}</Text>
                    {image && 
                        <Image style={styles.paymentImage} source={{uri: image.path}} />
                    }
                    {<FormButton
                        buttonTitle="Upload proof of payment"
                        onPress={()=> {
                            setPhotoModalVisible(true)
                        }}
                    />}
                    {error && <Text style={styles.errorText}>There was an error uploading selected picture.</Text>}
                </View>}
                {day && slot && image && 
                    <TouchableOpacity onPress={()=> uploadImage()} style={styles.proceedButton}>
                        <Text style={styles.proceedText}>Proceed</Text>
                    </TouchableOpacity>
                }
                <Modal
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    slideOutDown={300}
                    isVisible={photoModalVisible}
                    onBackButtonPress={() => {
                        setPhotoModalVisible(false)
                    }}
                    onBackdropPress	={() => {
                        setPhotoModalVisible(false)
                    }}
                >
                    <View style={styles.modalView}>
                        <FormButton
                            buttonTitle="Upload from gallery"
                            onPress={async ()=> {
                                try{
                                    const imageRes = await ImagePicker.openPicker({
                                        cropping: true
                                    })
                                    setImage(imageRes)
                                    setPhotoModalVisible(false)
                                } catch (error){
                                    setError(error)
                                    setPhotoModalVisible(false)
                                }
                            }} 
                        />
                        <FormButton
                            buttonTitle="Take picture"
                            onPress={async ()=> {
                                try {
                                    const imageRes = await ImagePicker.openCamera({
                                        cropping: true,
                                    })
                                    setImage(imageRes)
                                    setPhotoModalVisible(false)
                                } catch (error){
                                    setError(error)
                                    setPhotoModalVisible(false)
                                }
                            }} 
                        />
                    </View>
                </Modal>
                <Modal
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    // style={{flex: 1}}
                    slideOutDown={300}
                    isVisible={timeModalVisible}
                    onBackButtonPress={() => {
                        setTimeModalVisible(false)
                    }}
                    onBackdropPress	={() => {
                        setTimeModalVisible(false)
                    }}
                >
                    <View style={styles.timeModalView}>
                        {slots.map((selectedSlot, index)=> <TouchableOpacity onPress={()=> {slot!==selectedSlot && setSlot(selectedSlot); slot!==selectedSlot && setTimeModalVisible(false)}} key={index} style={slot===selectedSlot ? styles.singleSlotDisabled : styles.singleSlot}><Text style={styles.singleSlotText}>{selectedSlot}</Text></TouchableOpacity>)}
                    </View>
                </Modal>
                <Modal
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    style={{flex: 1}}
                    slideOutDown={300}
                    isVisible={proceedModalVisible}
                    onBackButtonPress={() => {}}
                    onBackdropPress	={() => {}}
                >
                    <View style={styles.proceedModalView}>
                        <Text style={styles.uploadingText}>Uploading... {transferred}%</Text>
                        {uploadResult==='success' && <Text style={styles.successUploadText}>Information updated succesfully!</Text>}
                        {uploadResult==='failure' && <Text style={styles.failureUploadText}>Error updating information.</Text>}
                        {uploadResult && <FormButton buttonTitle={uploadResult==='success' ? 'Continue' : 'Try again'} onPress={uploadResult==='success' ? ()=>navigation.replace('Home') : ()=> {setProceedModalVisible(false); setUploadResult('')}} />}
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
        backgroundColor: '#FEEBD6',
    },
    logoutButton: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 20,
        marginTop: 40
    },
    text: {
        fontSize: 25,
        color: '#FF8C88',
        fontWeight: '900',
        marginBottom: 30
    },
    step: {
        color: '#FF8C88',
        fontSize: 20,
        marginBottom: 10
    },
    fillInfo: {
        paddingTop: 25,
        paddingRight: 30,
        paddingLeft: 30
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
    timeModalView: {
        flex: 0.5,
        backgroundColor: '#2e2c2c',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 30,
        paddingBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageView: {
        marginTop: 20,
        marginBottom: 20,
    },
    paymentImage: {
        width: '100%',
        height: 150,
        resizeMode: 'stretch',
    },
    errorText: {
        color: '#f5625d',
        fontSize: 15,
        fontWeight: '700',
        marginTop: 10
    },
    calendarView: {
        marginBottom: 20,
    },
    mediumText: {
        color: '#111111',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10
    },
    singleSlot: {
        backgroundColor: '#FF8C88',
        width: '100%',
        height: '20%',
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    singleSlotDisabled: {
        backgroundColor: '#4b4c4d',
        width: '100%',
        height: '20%',
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    singleSlotText: {
        color: '#ffffff',
        fontSize: 25,
        fontWeight: '500'
    },
    proceedButton: {
        width: '100%',
        marginTop: 15,
        height: windowHeight/15,
        backgroundColor: '#FF8C88',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 25
    },
    proceedText: {
        color: '#ffffff',
        fontSize: windowHeight/40,
        fontWeight: '800',
    },
    proceedModalView: {
        flex: 0.3,
        backgroundColor: '#2e2c2c',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: {
        color: '#FF8C88',
        fontWeight: '800',
        fontSize: 23,
        marginBottom: 5
    },
    successUploadText: {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 12
    },
    failureUploadText: {
        color: '#f5625d',
        fontWeight: '500',
        fontSize: 18
    },

})

//make this component available to the app
export default LearnersLicenseScreen
