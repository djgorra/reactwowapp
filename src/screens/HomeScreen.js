import React, {useContext, useState} from "react"; 
import {Button, StyleSheet, Text, View } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";


const HomeScreen = ({navigation}) => {
    const {userInfo, isLoading, logout} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <LoadingSpinner visible={isLoading} />
            <Text style={styles.welcome}>Welcome {userInfo.user.name}</Text>
            <Button title="Profile" color="blue" onPress={() => navigation.navigate('Profile')}/>
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