import React, {useContext, useState, useCallback, useEffect} from "react"; 
import { TouchableOpacity, View, StyleSheet, ImageBackground } from "react-native";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from '../components/LoadingSpinner';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Input, Image, Text} from '../components/';
import BlueButton from '../components/BlueButton';
import SubmitButton from '../components/SubmitButton';
import ConnectButton from '../components/ConnectButton';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import alertBox from "../components/AlertBox.js"
import { BASE_URL } from "../config";

const isAndroid = Platform.OS === 'android';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const {setIsLoading, getData, setUserInfo, userInfo} = useContext(AuthContext);
    const {assets, colors, gradients, sizes} = useTheme();
    const {t} = useTranslation();

    const login = (email, password) => {
      setIsLoading(true);
      axios.post(`${BASE_URL}/api/users/sign_in?user[email]=${email}&user[password]=${password}`)
      .then(res => {
          let userInfo = res.data
          setUserInfo(userInfo);
          AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          axios.defaults.headers.common = {'Authorization': `Bearer ${userInfo.access_token}`};
          getData();
          setIsLoading(false);
      }).catch((error) => {
          // Error
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              alertBox("Invalid Email or Password")
              // console.log(error.response.status);
              // console.log(error.response.headers);
          } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the 
              // browser and an instance of
              // http.ClientRequest in node.js
              alertBox("Network Error")
              console.log(error.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              alertBox("An error has occurred :(")
              console.log('Error', error.message);
          }
          setIsLoading(false)
          console.log(error.config);
      })
  }

    return (
        <Block>
        <ImageBackground source={require('../assets/images/icecrown/login_bg2.png')} style={styles.container}>
        <Block paddingHorizontal={sizes.s}>
          <Block
            keyboard
            behavior={!isAndroid ? 'padding' : 'height'}
            marginTop={(sizes.height * 0.2)}>
            <Block
              flex={0}
              radius={sizes.sm}
              style={styles.card}
              marginHorizontal="8%"
              shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            >
              <Block
                flex={0}
                radius={sizes.sm}
                overflow="hidden"
                justify="space-evenly"
                paddingVertical={sizes.sm}>
                {/* social buttons */}
                <Image style={styles.logo} source={require('../assets/images/icecrown/logo.png')} />
                <Image source={require('../assets/images/icecrown/under_title.png')} style={{alignSelf: 'center'}} />
                
                <ConnectButton title="Battle.net Login"></ConnectButton>

                {/* form inputs */}
                <Block 
                paddingTop={sizes.sm}
                paddingHorizontal={sizes.sm}>
                  <Block style={styles.inputContainer}>
                    <Image style={styles.redDot} source={require('../assets/images/icecrown/red_dot.png')} />
                    <Input
                      white
                      autoCapitalize="none"
                      style={styles.input}
                      keyboardType="email-address"
                      placeholder="Email"
                      textAlign="center"
                      onChangeText={text => setEmail(text)}
                    />
                  </Block>

                  <Block style={styles.inputContainer}>
                    <Image style={styles.redDot} source={require('../assets/images/icecrown/red_dot.png')} />
                    <Input
                      secureTextEntry
                      white
                      autoCapitalize="none"
                      style={styles.input}
                      textAlign="center"
                      placeholder="Password"
                      onChangeText={text => setPassword(text)}
                    />
                  </Block>
                </Block>

                <SubmitButton
                  onPress={() => {login(email, password)}}
                  text="Log In">
                </SubmitButton>

                <BlueButton
                  onPress={() => navigation.navigate('Register')}
                  text="Register">
                </BlueButton>

              </Block>
            </Block>
          </Block>
        </Block>
        </ImageBackground>
      </Block>
    );
};

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        wrapper: {
            width:'80%',
        },
        logo: {
          opacity:1.0,
          width: 200,
          resizeMode: 'contain',
          alignSelf: 'center',
        },
        card: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            width: '80%',
            borderRadius: 10,
            padding: 10,
        },
        redDot: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
          position: 'absolute',
          left:5,
          top:24,
        },
        inputContainer: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        input: {
            flex: 1,
            width: '100%',
            textAlign: 'center',
            paddingTop: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingLeft: 0,
            color: '#424242',
            borderRadius: 0,
        },
        link: {
            color:'lightblue',
        },
    }
);
export default LoginScreen;