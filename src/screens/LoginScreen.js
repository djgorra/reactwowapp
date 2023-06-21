import React, {useContext, useState} from "react"; 
import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, useColorScheme, } from "react-native";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const val = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Text>{val}</Text>
                <TextInput 
                    style={styles.input} 
                    value={email} 
                    placeholder="Enter Email" 
                    onChangeText={text => setEmail(text)}/>

                <TextInput 
                    style={styles.input} 
                    value={password} 
                    placeholder="Enter Password" 
                    onChangeText={text => setEmail(text)}
                    secureTextEntry />

                <Button title="Login" />

                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <Text>Don't have any account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        wrapper: {
            width:'80%',
        },
        input: {
            marginBottom:12,
            borderWidth: 1,
            borderColor: '#bbb',
            borderRadius: 5,
            paddingHorizontal: 14,
        },
        link: {
            color:'blue',
        },
    }
);
export default LoginScreen;