import {useContext, useState} from "react"; 
import * as WebBrowser from 'expo-web-browser';
import {Button, StyleSheet, Text, View } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import ConnectButton from '../components/ConnectButton';
import { AuthContext } from "../context/AuthContext";
import {useData, useTheme, useTranslation} from '../hooks/';
import { SafeAreaView } from "react-native-safe-area-context";
WebBrowser.maybeCompleteAuthSession();

// Endpoint

const HomeScreen = ({navigation}) => {
    const {userInfo, isLoading} = useContext(AuthContext);
    const {t} = useTranslation();
    return (
        <SafeAreaView style={styles.container}>
            <LoadingSpinner visible={isLoading} />
            <Text style={styles.welcome}>Welcome!</Text>
            {
                userInfo["user"]["battletag"] ?  
                <Text style={styles.welcome}>Your Battletag is <Text style={styles.boldText}>{userInfo["user"]["battletag"]}</Text></Text> :
                <ConnectButton title="Connect your WOW Account"></ConnectButton>

            }
            <Button title="Add your user avatar!" color="blue" onPress={() => navigation.navigate('Profile')}/>
        </SafeAreaView>

        
    );
};


const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop:15
        },
        welcome: {
            fontSize: 18, 
            marginBottom: 8,
        },
        boldText: {
            fontWeight: 'bold',
        },
    }
);

export default HomeScreen;