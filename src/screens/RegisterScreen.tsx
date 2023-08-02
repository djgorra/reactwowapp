import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import { AuthContext } from '../context/AuthContext';
import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text} from '../components/';

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
      console.log('handleSignUp', registration);
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
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                Go Back
              </Text>
            </Button>

            <Text h4 center white marginBottom={sizes.md}>
                {t('app.name')}
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>

              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
              </Block>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Text h5 center>
                    {t('common.signup')}
                </Text>
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label="Email"
                  keyboardType="email-address"
                  placeholder="Email"
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value})}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label="Password"
                  placeholder="Password"
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
              </Block>

              <Button
                onPress={() => {
                    register(email, password);
                }}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  Sign Up
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default RegisterScreen;






















// import React, {useContext, useState} from "react"; 
// import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, useColorScheme, } from "react-native";
// import { AuthContext } from "../context/AuthContext";
// import LoadingSpinner from '../components/LoadingSpinner';

// const RegisterScreen = ({navigation}) => {
//     const [name, setName] = useState(null);
//     const [email, setEmail] = useState(null);
//     const [password, setPassword] = useState(null);
//     const {isLoading, register} = useContext(AuthContext);

//     return (
//         <View style={styles.container}>
//             <LoadingSpinner visible={isLoading} />
//             <View style={styles.wrapper}>
//                 <Text>Hello</Text>
//                 <TextInput 
//                     style={styles.input} 
//                     value={name} 
//                     placeholder="Enter Name" 
//                     onChangeText={text => setName(text)}/>
//                 <TextInput 
//                     style={styles.input} 
//                     value={email} 
//                     placeholder="Enter Email" 
//                     onChangeText={text => setEmail(text)}/>

//                 <TextInput 
//                     style={styles.input} 
//                     value={password} 
//                     placeholder="Enter Password" 
//                     onChangeText={text => setPassword(text)}
//                     secureTextEntry />

//                 <Button 
//                     title="Register" 
//                     onPress={() => {
//                         register(name, email, password);
//                     }}
//                 />

//                 <View style={{flexDirection: 'row', marginTop: 20}}>
//                     <Text>Already have an account? </Text>
//                     <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                         <Text style={styles.link}>Login</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create(
//     {
//         container: {
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center',
//         },
//         wrapper: {
//             width:'80%',
//         },
//         input: {
//             marginBottom:12,
//             borderWidth: 1,
//             borderColor: '#bbb',
//             borderRadius: 5,
//             paddingHorizontal: 14,
//         },
//         link: {
//             color:'blue',
//         },
//     }
// );

// export default RegisterScreen;