import React, {useContext, useState} from "react"; 
import {Button, StyleSheet, Text, View } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";


const ProfileScreen = () => {
    const {userInfo, isLoading, logout} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <LoadingSpinner visible={isLoading} />
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

export default ProfileScreen;