import {useContext, useState} from "react"; 
import * as WebBrowser from 'expo-web-browser';
import {Button, StyleSheet, Text, View, ImageBackground } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import ConnectButton from '../components/ConnectButton';
import { AuthContext } from "../context/AuthContext";
import {useData, useTheme, useTranslation} from '../hooks/';
import { SafeAreaView } from "react-native-safe-area-context";
import HomeButton from '../components/HomeButton';
import {Block} from '../components/';

WebBrowser.maybeCompleteAuthSession();

// Endpoint

const HomeScreen = ({navigation}) => {
    const {userInfo, isLoading} = useContext(AuthContext);
    const {t} = useTranslation();
    return (
        <ImageBackground source={require('../assets/images/icecrown/home_bg.png')} style={styles.container}>
            <SafeAreaView style={{width:'100%'}}>
                    <Block flex={0} row align="center" marginBottom={250}></Block>
                    <View style={styles.welcomeContainer}>
                        {
                            userInfo["user"]["battletag"] ?  
                            <Text style={styles.welcome}>Your Battletag is <Text style={styles.boldText}>{userInfo["user"]["battletag"]}</Text></Text> :
                            <ConnectButton title="Connect your WOW Account"></ConnectButton>
                            
                        }
                        <View style={styles.buttonContainer}>
                            <HomeButton text="Characters" color="blue" onPress={() => navigation.navigate('Characters')}/>
                            <HomeButton text="Friends" color="blue" onPress={() => navigation.navigate('Friends')}/>
                            <HomeButton text="Teams" color="blue" onPress={() => navigation.navigate('TeamListScreen')}/>
                        </View>
                    </View>
            </SafeAreaView>
        </ImageBackground>

        
    );
};


const styles = StyleSheet.create(
    {
        container: {
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        welcome: {
            fontSize: 24, 
            // fontFamily: 'LifeCraft',
            textAlign: 'center',
            textShadowRadius: 10,
            textShadowColor: 'black',
            textShadowOffset: {width: 1, height: 1},
            color: 'white',

        },
        boldText: {
            fontWeight: 'bold',
        },
        welcomeContainer: {
            width: '100%',

        },
        buttonContainer: {
            width: '100%',
            flexDirection: 'row',
            flexShrink: 1,
        }
    }
);

export default HomeScreen;