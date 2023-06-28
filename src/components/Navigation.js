import React, {useContext, useState} from "react"; 
import { Text, View, Button } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import UserScreen from "../screens/UserScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthContext } from "../context/AuthContext";


const Stack = createNativeStackNavigator();

const Navigation = () => {
    const {userInfo, logout} = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                
                {userInfo.access_token ? (
                    <>
                        <Stack.Screen
                            name="Home" 
                            component={HomeScreen}
                            options={{
                                headerRight: () => (
                                    <Button title="Logout" color="red" onPress={logout}/>
                                ),
                              }}
                        />
                        <Stack.Screen name="Profile" component={UserScreen}/>
                    </>
                    ) : (
                    <>
                        <Stack.Screen 
                            name="Login" 
                            component={LoginScreen} 
                            options={{headerShown: false}}
                        />
                        <Stack.Screen 
                            name="Register" 
                            component={RegisterScreen} 
                            options={{headerShown: false}}
                        />
                    </>
                    )}

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;