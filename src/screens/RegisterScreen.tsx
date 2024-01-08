import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Platform, StyleSheet, ImageBackground, Text} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import { AuthContext } from '../context/AuthContext';
import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image} from '../components/';
import SubmitButton from '../components/SubmitButton';

const isAndroid = Platform.OS === 'android';

interface IRegistration {
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const RegisterScreen = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {register} = useContext(AuthContext);
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    email: false,
    password: false,
    agreed: true,
  });
  const [registration, setRegistration] =  useState<IRegistration>({
    email: '',
    password: '',
    agreed: true,
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
      if(value.email){
        setEmail(value.email);
      }else if (value.password){
        setPassword(value.password);
      }
    },
    [setRegistration],
  );

  const handleSignUp = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      /** send/save registratin data */
    }
  }, [isValid, registration]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

  return (
    <Block safe color={colors.primary} marginTop={sizes.md}>
        <ImageBackground source={require('../assets/images/icecrown/login_bg1.png')} style={styles.container}>
        <Block paddingHorizontal={sizes.s}>
          {/* register form */}
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
              <Button
                style={{alignSelf: 'flex-start'}}
                row
                onPress={() => navigation.goBack()}>
                <Image
                  radius={0}
                  width={10}
                  height={18}
                  color={colors.white}
                  source={assets.arrow}
                  transform={[{rotate: '180deg'}]}
                />
                <Text style={{color:"white"}} marginLeft={sizes.s}>
                  Back
                </Text>
              </Button>
              <Block
                flex={0}
                radius={sizes.sm}
                overflow="hidden"
                justify="space-evenly"
                paddingVertical={sizes.sm}>
                {/* social buttons */}
                <Image style={styles.logo} source={require('../assets/images/icecrown/logo.png')} />
                <Image source={require('../assets/images/icecrown/under_title.png')} style={{alignSelf: 'center'}} />
                

                {/* form inputs */}
                <Block 
                paddingTop={sizes.sm}
                paddingHorizontal={sizes.sm}>
                  <Block style={styles.inputContainer}>
                    <Image style={styles.redDot} source={require('../assets/images/icecrown/red_dot.png')} />
                    <Input
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="email..."
                      textAlign='center'
                      style={styles.input}
                      success={Boolean(registration.email && isValid.email)}
                      danger={Boolean(registration.email && !isValid.email)}
                      onChangeText={(value) => handleChange({email: value})}
                    />
                  </Block>

                  <Block style={styles.inputContainer}>
                    <Image style={styles.redDot} source={require('../assets/images/icecrown/red_dot.png')} />
                    <Input
                      secureTextEntry
                      autoCapitalize="none"
                      marginBottom={sizes.m}
                      style={styles.input}
                      textAlign="center"
                      placeholder="password..."
                      onChangeText={(value) => handleChange({password: value})}
                      success={Boolean(registration.password && isValid.password)}
                      danger={Boolean(registration.password && !isValid.password)}
                    />
                  </Block>
                </Block>

                <SubmitButton
                  onPress={() => {register(email, password)}}
                  text="Sign Up">
                </SubmitButton>

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
      },
      link: {
          color:'lightblue',
      },
  }
);

export default RegisterScreen;