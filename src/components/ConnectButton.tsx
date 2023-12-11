import {useContext, useState} from "react"; 
import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import {View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as env from '../constants/env';
import {useTheme} from '../hooks/';
import {Text, Block} from '../components/';
import BlueButton from '../components/BlueButton';
import uuid from 'react-native-uuid';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import alertBox from "../components/AlertBox.js"
import { BASE_URL } from "../config";
WebBrowser.maybeCompleteAuthSession();



const ConnectButton = ({title}) => {
    const [myUuid, setMyUuid] = useState(uuid.v4());
    const {colors, sizes} = useTheme();
    const discovery = {
      authorizationEndpoint: 'https://oauth.battle.net/authorize',
      tokenEndpoint: 'https://oauth.battle.net/token',
    };
    const {userInfo, setIsLoading, setUserInfo, getData} = useContext(AuthContext);

    const login_with_uuid = () => {
      setIsLoading(true);
      axios.post(`${BASE_URL}/api/users/uuid?uuid=${myUuid}`)
      .then(res => {
          let userInfo = res.data;
          setUserInfo(userInfo);
          AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          axios.defaults.headers.common = {'Authorization': `Bearer ${userInfo.access_token}`};
          getData();
          setIsLoading(false);
      }).catch((error) => {
          // Error
          if (error.response) {
              console.log(error.response.data);
          } else if (error.request) {
              alertBox("Network Error");
              console.log(error.request);
          } else {
              console.log('Error', error.message);
          }
          setIsLoading(false);
      })
    }
    const [request, response, promptAsync] = useAuthRequest(
      userInfo ?
      {
        clientId: env.CLIENT_ID,
        scopes: ['wow.profile'],
        state: myUuid,
        redirectUri: env.REDIRECT_URI
      } :
      {
            clientId: env.CLIENT_ID,
            scopes: ['wow.profile'],
            state: userInfo["user"]["email"],
            redirectUri: env.REDIRECT_URI
        },
        discovery
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            console.log("Success");
        } else if (response?.type === 'cancel'){
          login_with_uuid();
        }
    }, [response]);

    return (
        <View paddingTop={sizes.sm}>
            <Block>
            <BlueButton
                disabled={!request}
                text={title}
                onPress={() => {
                    promptAsync();
                }}
                 color={colors.secondary} margin={sizes.base}
            >
            </BlueButton>
            </Block>
        </View>

        
    );
};
export default ConnectButton;