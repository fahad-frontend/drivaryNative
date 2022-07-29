import React, { useContext, useState} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView
} from 'react-native'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import SocialButton from '../components/SocialButton'
import { AuthContext } from '../navigation/AuthProvider'

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [confirm, setConfirm] = useState(null)
  const [code, setCode] = useState('')
  const {login, googleLogin, facebookLogin, phoneLogin} = useContext(AuthContext)

  const confirmCode = async () => {
    console.log(confirm)
    try {
      await confirm.confirm('156779');
    } catch (error) {
      console.log(error)
    }
  }

  const sendCode = async () => {
    const confirmation = await phoneLogin(phoneNumber)
    setConfirm(confirmation)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/rn-social-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>Drivary</Text>
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
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign In"
        onPress={() => login(email, password)}
      />

      <FormInput
        labelValue={phoneNumber}
        onChangeText={(userNumber) => setPhoneNumber(userNumber)}
        placeholderText="Phone Number"
        keyboardType='phone-pad'
      />

      <FormButton
        buttonTitle={!confirm ? 'Sign In' : 'Confirm Code'}
        onPress={() => !confirm ? sendCode() : confirmCode() }
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

    {Platform.OS==='android' && <View>
        <SocialButton
          buttonTitle="Sign In with Facebook"
          btnType="facebook"
          color="#4867aa"
          backgroundColor="#e6eaf4"
          onPress={() => facebookLogin()}
        />
        
        <SocialButton
          buttonTitle='Sign In with Google'
          btnType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          onPress={() => googleLogin()}
        />
      </View>}

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.navButtonText}>
          Don't have an acount? Create here
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
})
