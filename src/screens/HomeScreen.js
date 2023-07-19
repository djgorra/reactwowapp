import {useContext, useState} from "react"; 
import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import {Button, StyleSheet, Text, View, Platform } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";
import * as env from '../constants/env';

WebBrowser.maybeCompleteAuthSession();

// Endpoint

const HomeScreen = ({navigation}) => {
    const discovery = {
      authorizationEndpoint: 'https://oauth.battle.net/authorize',
      tokenEndpoint: 'https://oauth.battle.net/token',
    };
    const {userInfo, isLoading, getUser} = useContext(AuthContext);
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: env.CLIENT_ID,
            // There are no scopes so just pass an empty array
            scopes: ['wow.profile'],
            state: userInfo["user"]["email"],
            // Dropbox doesn't support PKCE
            // usePKCE: false,
            // For usage in managed apps using the proxy
            redirectUri: env.REDIRECT_URI
        },
        discovery
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            console.log("Success");
            console.log(response.params);
        } else if (response?.type === 'cancel'){
            getUser();
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <LoadingSpinner visible={isLoading} />
            <Text style={styles.welcome}>Welcome {userInfo["user"]["name"]}</Text>
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