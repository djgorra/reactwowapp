import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, TextInput, View, Alert } from "react-native";
import {Text} from '../components/';

import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";
import {BASE_URL} from "../config";
import axios from "axios";

const ProfileScreen = () => {
    const {userInfo, isLoading, logout, updateUser, friends, getFriends} = useContext(AuthContext);
    const currentName = userInfo["user"]["username"] ? userInfo["user"]["username"] : null;
    const [name, setName] = useState(currentName);
    console.log(userInfo);

    useEffect(() => {
        getFriends();
    }
    , []);

    return (
        <View style={styles.container}>
            <LoadingSpinner visible={isLoading} />
            <Text white h3>Profile Page</Text>
            <Text white>Battletag: {userInfo["user"]["battletag"] ? userInfo["user"]["battletag"] : "Not Linked"}</Text>
            <Text white>Number of characters: {userInfo["characters"].length}</Text>
            <Text white>Number of friends: {friends ? friends.length : 0}</Text>
            <Button
                title="Delete Account"
                onPress={() => 
                    Alert.alert('Delete Account', 'Are you sure you wish to delete your account? This cannot be undone.', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {text: 'OK', onPress: () => 
                        axios({
                            url:`${BASE_URL}/api/users/${userInfo["user"]["id"]}`,
                            method : "DELETE",
                        }).then(() => {
                            logout();
                        })}
                    ])
                    
                }>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create(
    {
        container: {
            padding:50,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'space-around',

            height: '100%',
            color: '#fff',
            backgroundColor: '#02000b'
          },
    }
);

export default ProfileScreen;