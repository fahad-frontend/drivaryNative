import React from "react"
import { View, Text, Button, StyleSheet, Image } from "react-native"
import Onboarding from 'react-native-onboarding-swiper'

const OnboardingScreen = ({navigation}) => {
    return (
        <Onboarding
            onDone={()=> navigation.replace('SocialLogin')}
            onSkip={()=> navigation.navigate('SocialLogin')}
            pages={[
            {
                backgroundColor: '#FF8C88',
                image: <Image style={styles.centerImage} source={require('../../assets/onboarding-images/fill-info.png')} />,
                title: 'Complete Profile',
                subtitle: 'Provide basic details about yourself, your driving history, as well as contact information.',
                subTitleStyles: {fontSize: 16, fontWeight: '700'},
                titleStyles: {fontWeight: '600'}
            },
            {
                backgroundColor: '#FF8C88',
                image: <Image style={styles.centerImage} source={require('../../assets/onboarding-images/select-date.png')} />,
                title: 'Select Dates',
                subtitle: 'Check available slots to book your lessons.',
                subTitleStyles: {fontSize: 16, fontWeight: '700'},
                titleStyles: {fontWeight: '600'}
            },
            {
                backgroundColor: '#FF8C88',
                image: <Image style={styles.centerImage} source={require('../../assets/onboarding-images/learn-driving.png')} />,
                title: 'Take Lessons',
                subtitle: 'Learn driving from our professional trainers who will teach you all you need to know to get on the road.',
                subTitleStyles: {fontSize: 16, fontWeight: '700'},
                titleStyles: {fontWeight: '600'}
            },
            {
                backgroundColor: '#FF8C88',
                image: <Image style={styles.centerImage} source={require('../../assets/onboarding-images/get-license.jpg')} />,
                title: 'Get you license!',
                subtitle: "Let us guide you through the entire process of actually getting your driver's license.",
                subTitleStyles: {fontSize: 16, fontWeight: '700'},
                titleStyles: {fontWeight: '600'}
            },
            ]}
        />
    )
}

export default OnboardingScreen

const styles = StyleSheet.create({
    centerImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    }
})