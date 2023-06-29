import React, {useContext, useState} from "react"; 
import { Text, View, Button, Settings } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DrawerItems from '../constants/DrawerItems';
import { AuthContext } from "../context/AuthContext";

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Root() {

    return (
        <Drawer.Navigator
        drawerType="front"
        initialRouteName="Home"
        screenOptions={{
            activeTintColor: '#e91e63',
            itemStyle: { marginVertical: 10 },
        }}
        >
        {
            DrawerItems.map(drawer=><Drawer.Screen
                key={drawer.name}
                name={drawer.name}
                options={{
                drawerIcon:({focused})=>
                 drawer.iconType==='MaterialCommunityIcons' ?
            <MaterialCommunityIcons
                      name={drawer.iconName}
                      size={24}
                      color={focused ? "#e91e63" : "black"}
                  />
                :
                drawer.iconType==='Feather' ?
            <Feather
                    name={drawer.iconName}
                    size={24}
                    color={focused ? "#e91e63" : "black"}
                  />
                :
            <FontAwesome5
                    name={drawer.iconName}
                    size={24}
                    color={focused ? "#e91e63" : "black"}
                  />}}
                component={
                  drawer.name==='Home' ? HomeScreen 
                    : drawer.name==='Profile' ? ProfileScreen
                        : drawer.name==='Settings' ? SettingsScreen
                            : SettingsScreen
                }
              />)
        }
        </Drawer.Navigator>
    );
  }

const Navigation = () => {
    const {userInfo, logout} = useContext(AuthContext);

    return (
        <NavigationContainer>


            <Stack.Navigator>
                
                
                {userInfo.access_token ? (
                    <>
                    <Stack.Screen options={{
                        }} name="Root" component={Root}
                        options={{ headerShown: false }} />
                        <Stack.Screen
                            name="Home" 
                            component={HomeScreen}
                            options={{
                                headerRight: () => (
                                    <Button title="Logout" color="red" onPress={logout}/>
                                ),
                              }}
                        />
                        <Stack.Screen name="Profile" component={ProfileScreen}/>
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