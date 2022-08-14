import React, { useState, useContext, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import Modal from 'react-native-modal'
import { AirbnbRating } from 'react-native-ratings'
import Accordion from 'react-native-collapsible/Accordion'
import { lessonsData } from '../utils/Enums'
import { AuthContext } from '../navigation/AuthProvider'
import { updateUser } from '../utils/Functions'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const LessonsProgressScreen = () => {
    const { user, setUser, logout } = useContext(AuthContext)
    const [activeSections, setActiveSections] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [multipleSelect] = useState(true)
    const [rating, setRating] = useState({
        accuracy: 3,
        speed: 3,
        composure: 3,
        confidence: 3,
    })
    const [currentLesson, setCurrentLesson] = useState()

    useEffect(()=> {
        if (user){
            const currentLessonStep = user?.lessons ? Object.values(user?.lessons)?.length+1 : 1
            setCurrentLesson(lessonsData?.find(lesson=> lesson?.step===currentLessonStep))
        }
    }, [user])

    useEffect(() => {
        const subscriber = firestore().collection('Users').doc(user?.uid).onSnapshot(documentSnapshot => {
            const listenerData = documentSnapshot.data()
            if (listenerData){
                setUser(prev=> ({...prev, ...listenerData}))
            }
        })
        return () => subscriber()
    }, [])

    const setSections = (sections) => {
        const allowedSections = sections.includes(undefined) ? [] : sections?.filter(section=> section+1<=currentLesson?.step)
        setActiveSections(allowedSections)
    }

    const addLessonRating = () => {
        updateUser({
            _id: user?.uid || user?._id,
            lessons: 
                {
                    [currentLesson?.key]: {
                        name: currentLesson?.title,
                        userRating: {
                            ...rating,
                            total: ((Object.values(rating).reduce((previousValue, currentValue) => previousValue + currentValue,0))/Object.values(rating)?.length).toFixed(1)
                        }
                    }
                }
        })
        setModalVisible(false)
        setActiveSections([])
    }

    const renderHeader = (section, _, isActive) => (
        <Animatable.View
            duration={250}
            style={[styles.header, isActive ? styles.active : styles.inactive, section?.step>currentLesson?.step && styles.disabledLesson]}
            transition="backgroundColor"
        >
            <Text style={{
                color: (section?.step>currentLesson?.step || isActive) ? '#ffffff' : '#FF8C88',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '800',
            }}>{section.title}</Text>
        </Animatable.View>
    )

    const renderContent = (section, _, isActive) => (
        <Animatable.View
            duration={300}
            style={[styles.content, isActive ? styles.active : styles.inactive]}
            animation={isActive ? 'bounceIn' : undefined}
        >
            <Text style={{ textAlign: 'center', color:'#ffffff', marginBottom: 10}}>{section.content}</Text>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'flex-end',
                marginTop: 10
            }}>
                <Text style={{ color:'#525150', fontSize: 15, fontWeight: '600'}}>Your Rating:</Text>             
                <TouchableOpacity onPress={()=> !user?.lessons?.[section?.key]?.userRating && setModalVisible(true)}>
                    <Text style={{color: 'yellow', fontSize: 15, marginLeft: 5}}>
                        {user?.lessons?.[section?.key]?.userRating?.total || `Give Rating`}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'flex-end',
                marginTop: 10
            }}>
                <Text style={{ color:'#525150', fontSize: 15, fontWeight: '600'}}>Instructor's Rating:</Text>
                <Text style={{color: 'yellow', fontSize: 15, marginLeft: 5}}>
                    To be given
                </Text>
            </View>
        </Animatable.View>
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.logoutButton} onPress={()=> logout()}>
                    <MaterialIcons name='logout' color='#111111' size={40} />
                </TouchableOpacity>
                <ScrollView>
                    <View style={styles.accordionView}>
                        <Accordion
                            activeSections={activeSections}
                            sections={lessonsData}
                            touchableComponent={TouchableOpacity}
                            expandMultiple={multipleSelect}
                            renderHeader={renderHeader}
                            renderContent={renderContent}
                            duration={300}
                            onChange={setSections}
                        />
                    </View>
                    <Modal
                        animationIn='slideInUp'
                        animationOut='slideOutDown'
                        slideOutDown={300}
                        isVisible={modalVisible}
                        onBackButtonPress={() => {
                            setModalVisible(false)
                        }}
                        onBackdropPress	={() => {
                            setModalVisible(false)
                        }}
                    >
                        <View style={styles.modalView}>
                            <Text style={{ textAlign: 'center', color:'#ffffff', fontSize: 25, fontWeight: '600', marginTop: 50}}>Accuracy</Text>
                            <AirbnbRating
                                count={5}
                                reviews={["Terrible", "Bad", "OK", "Good", "Amazing"]}
                                defaultRating={3}
                                size={15}
                                onFinishRating={(value)=> setRating(prev=> ({...prev, accuracy: value}))}
                            />
                            <Text style={{ textAlign: 'center', color:'#ffffff', fontSize: 25, fontWeight: '600', marginTop: 50}}>Speed</Text>
                            <AirbnbRating
                                count={5}
                                reviews={["Terrible", "Bad", "OK", "Good", "Amazing"]}
                                defaultRating={3}
                                size={15}
                                onFinishRating={(value)=> setRating(prev=> ({...prev, speed: value}))}
                            />
                            <Text style={{ textAlign: 'center', color:'#ffffff', fontSize: 25, fontWeight: '600', marginTop: 50}}>Composure</Text>
                            <AirbnbRating
                                count={5}
                                reviews={["Terrible", "Bad", "OK", "Good", "Amazing"]}
                                defaultRating={3}
                                size={15}
                                onFinishRating={(value)=> setRating(prev=> ({...prev, composure: value}))}
                            />
                            <Text style={{ textAlign: 'center', color:'#ffffff', fontSize: 25, fontWeight: '600', marginTop: 50}}>Confidence</Text>
                            <AirbnbRating
                                count={5}
                                reviews={["Terrible", "Bad", "OK", "Good", "Amazing"]}
                                defaultRating={3}
                                size={15}
                                onFinishRating={(value)=> setRating(prev=> ({...prev, confidence: value}))}
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={()=> addLessonRating()}>
                                <Text style={styles.submitButtonText}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default LessonsProgressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEEBD6',
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {
        padding: 20,
        borderColor: '#FF8C88',
        borderWidth: 2,
    },
    content: {
        padding: 20,
        backgroundColor: '#ffffff',
    },
    active: {
        backgroundColor: '#FF8C88',
    },
    inactive: {
        backgroundColor: '#FEEBD6',
    },
    selectors: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    selector: {
        backgroundColor: '#111111',
        padding: 10,
    },
    activeSelector: {
        fontWeight: 'bold',
    },
    selectTitle: {
        fontSize: 30,
        color: '#111111',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    accordionView: {
        borderTopColor: '#FF8C88',
        borderTopWidth: 2,
        borderBottomColor: '#FF8C88',
        borderBottomWidth: 2,
        borderRightColor: '#FF8C88',
        borderRightWidth: 2,
        borderLeftColor: '#FF8C88',
        borderLeftWidth: 2,
    },
    submitButton: {
        marginTop: 40,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 30,
        paddingLeft: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#FF8C88',
        // width: '50%'
    },
    submitButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    disabledLesson: {
        backgroundColor: '#9fa0a1'
    },
    logoutButton: {
        alignItems: 'flex-end',
        marginRight: 20,
        marginTop: 20,
        marginBottom: 20,
    },
})