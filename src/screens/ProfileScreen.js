import React, {useContext, useState} from "react"; 
import {Button, StyleSheet, Text, TextInput, View } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";
import UploadImage from '../components/UploadImage';

const ProfileScreen = () => {
    const {userInfo, isLoading, logout, updateUser} = useContext(AuthContext);
    const currentName = userInfo["user"]["username"] ? userInfo["user"]["username"] : null;
    const [name, setName] = useState(currentName);
    return (
        <View style={styles.container}>
            <LoadingSpinner visible={isLoading} />
            <Text>Profile Page</Text>
            <UploadImage/>
            <Text style={styles.welcome}>Welcome {userInfo["user"]["username"]}!</Text>
            <TextInput 
                    style={styles.input} 
                    value={name} 
                    placeholder="Update Username" 
                    onChangeText={text => setName(text)}/>
            <Button 
                    title="Update" 
                    onPress={() => {
                        updateUser(name);
                    }}
            />
        </View>
    );
};

const styles = StyleSheet.create(
    {
        container: {
            padding:50,
            backgroundColor: '#fff',
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