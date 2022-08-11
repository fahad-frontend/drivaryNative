import React, {useContext, useState} from 'react'
import {ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import {AuthContext} from '../navigation/AuthProvider'

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState()
  const [name, setName] = useState()
  const [password, setPassword] = useState()

  const {register, setUser} = useContext(AuthContext)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoView}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>Create an account</Text>
      </View>
      <View style={styles.signupView}>
        <FormInput
          labelValue={name}
          onChangeText={(userName) => setName(userName)}
          placeholderText="Full Name"
          iconType="user"
          autoCapitalize='characters'
          autoCorrect={false}
        />

        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          iconType="form"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton
          buttonTitle="Sign Up"
          onPress={async () => {
            setUser(prev=> ({...prev, displayName: name}))
            await register(email, password)
          }}
        />
      </View>
      <View style={styles.textPrivate}>
        <Text style={styles.color_textPrivate}>
          By registering, you confirm that you accept our{' '}
        </Text>
        <TouchableOpacity onPress={() => Alert.alert(
          "Terms of service",
          "Our terms of service."
        )}>
          <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
            Terms of service
          </Text>
        </TouchableOpacity>
        <Text style={styles.color_textPrivate}> and </Text>
        <TouchableOpacity onPress={() => Alert.alert(
          "Privacy policy",
          "Our privacy policy."
        )}>
          <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('SocialLogin')}>
          <Text style={styles.navButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e2c2c',
    flex: 1,
  },
  logoView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1.5,
    // backgroundColor: 'blue',
  },
  logo: {
    height: 90,
    width: 260,
    resizeMode: 'stretch'
  },
  text: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: '900',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginTop: 30
  },
  signupView: {
    paddingTop: 60,
    paddingRight: 25,
    paddingLeft: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    // backgroundColor: 'green'
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flex: 1.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingRight: 25,
    paddingLeft: 25,
    // backgroundColor: 'red',
    paddingTop: 100
  },
  color_textPrivate: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
