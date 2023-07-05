import React, {useContext, useState} from "react"; 
import {Button, StyleSheet, Text, TextInput, View } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";


const ProfileScreen = () => {
    const [name, setName] = useState(null);
    const {userInfo, isLoading, updateUser, logout} = useContext(AuthContext);
    //console.log(JSON.stringify(userInfo)); //tip: this is shown on every keypress
    return (
        <View style={styles.container}>
            <LoadingSpinner visible={isLoading} />
            <Text>Profile Page</Text>
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