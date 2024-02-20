import {useContext, useState} from "react"; 
import * as WebBrowser from 'expo-web-browser';
import {Button, StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import ConnectButton from '../components/ConnectButton';
import { AuthContext } from "../context/AuthContext";
import {useData, useTheme, useTranslation} from '../hooks/';
import { SafeAreaView } from "react-native-safe-area-context";
import HomeButton from '../components/HomeButton';
import {Block} from '../components/';
import version_picker1 from '../assets/images/icecrown/version_picker1.png';
import version_picker2 from '../assets/images/icecrown/version_picker2.png';
import version_picker3 from '../assets/images/icecrown/version_picker3.png';

WebBrowser.maybeCompleteAuthSession();

// Endpoint

const HomeScreen = ({navigation}) => {
    const {userInfo, isLoading, version, setVersion, getData} = useContext(AuthContext);
    const {t} = useTranslation();
    const [versionImage, setVersionImage] = useState(version_picker3);

    function versionPress(version){
        setVersion(version);
        setVersionImage(version == 1 ? version_picker1 : version == 2 ? version_picker2 : version_picker3);
        getData();
    };

    return (
        <ImageBackground source={require('../assets/images/icecrown/home_bg.png')} style={styles.container}>
            <SafeAreaView style={{width:'100%'}}>
                    <Block flex={0} row align="center" marginBottom={250}></Block>

                    <ImageBackground source={versionImage} style={styles.versionContainer}>
                        <TouchableOpacity style={styles.versionButton} onPress={() => versionPress(1)}></TouchableOpacity>
                        <TouchableOpacity style={styles.versionButton} onPress={() => versionPress(2)}></TouchableOpacity>
                        <TouchableOpacity style={styles.versionButton} onPress={() => versionPress(3)}></TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.welcomeContainer}>
                        {
                            userInfo["user"]["battletag"] ?  
                            <Text style={styles.welcome}>Your Battletag is <Text style={styles.boldText}>{userInfo["user"]["battletag"]}</Text></Text> :
                            <ConnectButton title="Connect your WOW Account"></ConnectButton>
                            
                        }
                        <View style={styles.buttonContainer}>
                            <HomeButton text="Characters" color="blue" onPress={() => navigation.navigate('Characters')}/>
                            <HomeButton text="Friends" color="blue" onPress={() => navigation.navigate('FriendsListScreen')}/>
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
            justifyContent: 'space-evenly',
            marginTop: 20,
        },

        versionButton: {
            backgroundColor: 'transparent',
            height: 160,
            width: '33.3%',
   
        },
        versionContainer: {
            width: 250, 
            height: 160, 
            marginBottom: 20, 
            flexDirection: 'row',
            alignSelf: 'center',
        },
        selected: {
            backgroundColor: 'white',
        },
    }
);

export default HomeScreen;