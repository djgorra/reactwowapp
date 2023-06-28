import React, {useContext, useState} from "react"; 
import {Button, StyleSheet, Text, View } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";


const SettingsScreen = () => {
    const {userInfo, isLoading, logout} = useContext(AuthContext);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{fontSize:16,fontWeight:'700'}}>Settings Screen</Text>
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

export default SettingsScreen;


