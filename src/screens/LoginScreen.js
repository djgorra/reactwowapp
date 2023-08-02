import React, {useContext, useState, useCallback, useEffect} from "react"; 
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from '../components/LoadingSpinner';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Input, Image, Text} from '../components/';

const isAndroid = Platform.OS === 'android';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const {isLoading, login} = useContext(AuthContext);
    const {assets, colors, gradients, sizes} = useTheme();
    const {t} = useTranslation();

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
                  transform={[{rotate: '180deg'}]}
                />
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
                    {t('common.signin')}
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
                    onChangeText={text => setEmail(text)}
                  />
                  <Input
                    secureTextEntry
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label="Password"
                    placeholder="Password"
                    onChangeText={text => setPassword(text)}
                  />
                </Block>

                <Button
                onPress={() => {login(email, password)}}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}>
                <Text bold white transform="uppercase">
                  Log In
                </Text>
              </Button>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                     <Text>Don't have any account? </Text>
                     <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                         <Text style={styles.link}>Register</Text>
                     </TouchableOpacity>
                </View>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
        // <View style={styles.container}>
        //     <LoadingSpinner visible={isLoading} />
        //     <View style={styles.wrapper}>
        //         <Text>Log In</Text>
        //         <TextInput 
        //             style={styles.input} 
        //             value={email} 
        //             placeholder="Enter Email" 
        //             onChangeText={text => setEmail(text)}/>

        //         <TextInput 
        //             style={styles.input} 
        //             value={password} 
        //             placeholder="Enter Password" 
        //             onChangeText={text => setPassword(text)}
        //             secureTextEntry />

        //         <Button title="Login" onPress={() => {login(email, password)}}/>

        //         <View style={{flexDirection: 'row', marginTop: 20}}>
        //             <Text>Don't have any account? </Text>
        //             <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        //                 <Text style={styles.link}>Register</Text>
        //             </TouchableOpacity>
        //         </View>
        //     </View>
        // </View>
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
        input: {
            marginBottom:12,
            borderWidth: 1,
            borderColor: '#bbb',
            borderRadius: 5,
            paddingHorizontal: 14,
        },
        link: {
            color:'blue',
        },
    }
);
export default LoginScreen;