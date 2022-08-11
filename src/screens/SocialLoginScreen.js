import React, { useContext, useState} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native'
import FormInput from '../components/FormInput'
import SocialButton from '../components/SocialButton'
import { AuthContext } from '../navigation/AuthProvider'
import ErrorBoundary from 'react-native-error-boundary'

const SocialLoginScreen = ({navigation}) => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const {login, googleLogin, facebookLogin} = useContext(AuthContext)

  const loginErrorHandler = () => {
    Alert.alert(
      "Error logging in",
      "There was an error logging in. Please try again."
    )
  }

  return (
    <ErrorBoundary onError={loginErrorHandler}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoView}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>Welcome to the Drivary App</Text>
        </View>
        <View style={styles.loginView}>
          <FormInput
            labelValue={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            placeholderText="Email"
            iconType="user"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormInput
            labelValue={password}
            style={styles.passwordInput}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
          />
          <SocialButton
            buttonTitle="Sign In with Email"
            backgroundColor="#111111"
            btnType='envelope'
            color="#ffffff"
            onPress={() => login(email, password)}
          />
        </View>
        <View style={styles.navButtonsContainer}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.navButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.navButtonText}>
              Create account
            </Text>
          </TouchableOpacity>
        </View>
        {Platform.OS==='android' && 
        <View style={styles.socialLoginView}>
          <SocialButton
            buttonTitle="Continue with Facebook"
            btnType="facebook"
            color="#e6eaf4"
            backgroundColor="#4867aa"
            onPress={() => facebookLogin()}
          />
          <SocialButton
            buttonTitle='Continue with Google'
            btnType="google"
            color="#f5e7ea"
            backgroundColor="#de4d41"
            onPress={() => googleLogin()}
          />
        </View>}
      </ScrollView>
    </ErrorBoundary>
  )
}

export default SocialLoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e2c2c',
    flex: 1,
  },  
  logo: {
    height: 90,
    width: 260,
    resizeMode: 'stretch'
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Lato-Regular',
    marginTop: 10,
    textAlign: 'center'
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: '900',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginTop: 20
  },
  passwordInput: {
    paddingLeft: 10,
  },
  logoView: {
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1.5,
    // backgroundColor: 'blue',
  },
  loginView: {
    paddingTop: 25,
    paddingRight: 25,
    paddingLeft: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    // backgroundColor: 'green'
  },
  socialLoginView: {
    flex: 2,
    // backgroundColor: 'red',
    paddingRight: 25,
    paddingLeft: 25,
  },
  navButtonsContainer: {
    display: 'flex',
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 30,
    paddingLeft: 30,
    // backgroundColor: 'yellow'
  }
})
