import React, {useContext, useState} from "react"; 
import {Button, StyleSheet, Text, View } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from "../context/AuthContext";


const UserScreen = () => {
    const {userInfo, isLoading, logout} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Spinner visible={isLoading} />
            <Text>Profile Page</Text>
            <Text style={styles.welcome}>{userInfo.user.name}</Text>
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

export default UserScreen;