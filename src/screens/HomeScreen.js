import {useContext, useState} from "react"; 
import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

import {Button, StyleSheet, Text, View, Platform } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

// Endpoint

const HomeScreen = ({navigation}) => {
    const discovery = {
      authorizationEndpoint: 'https://oauth.battle.net/authorize',
      tokenEndpoint: 'https://oauth.battle.net/token',
    };
    const {userInfo, isLoading, logout} = useContext(AuthContext);
    const useProxy = Platform.select({ web: false, default: true });
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '6e5be73d7bb84defbfe49d9fb5eb4581',
            // There are no scopes so just pass an empty array
            scopes: ['wow.profile'],
            // Dropbox doesn't support PKCE
            // usePKCE: false,
            // For usage in managed apps using the proxy
            redirectUri: makeRedirectUri({
                scheme: 'myapp',
              })
        },
        discovery
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <LoadingSpinner visible={isLoading} />
            <Text style={styles.welcome}>Welcome {userInfo.user.name}</Text>
            <Button title="Profile" color="blue" onPress={() => navigation.navigate('Profile')}/>
            <Button
                disabled={!request}
                title="Connect your WoW account"
                onPress={() => {
                    promptAsync();
                }}
            />
        </View>

        
    );
};


const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        welcome: {
            fontSize: 18, 
            marginBottom: 8,
        }
    }
);

export default HomeScreen;