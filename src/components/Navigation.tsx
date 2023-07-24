import React, {useContext, useState, useEffect} from "react"; 
import { Text, View, Button, Settings } from "react-native";

import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthContext } from "../context/AuthContext";
import MainMenu from "../components/MainMenu";
import {useFonts} from 'expo-font';
import {useData, ThemeProvider, TranslationProvider} from '../hooks/';

import {Platform, StatusBar} from 'react-native';
import AppLoading from 'expo-app-loading';
import Menu from './Menu';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    const {userInfo, logout} = useContext(AuthContext);
    const {isDark, theme, setTheme} = useData();
    /* set the status bar based on isDark constant */
    useEffect(() => {
        Platform.OS === 'android' && StatusBar.setTranslucent(true);
        StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
        return () => {
        StatusBar.setBarStyle('default');
        };
    }, [isDark]);
    // load custom fonts
    const [fontsLoaded] = useFonts({
        'OpenSans-Light': theme.assets.OpenSansLight,
        'OpenSans-Regular': theme.assets.OpenSansRegular,
        'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
        'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
        'OpenSans-Bold': theme.assets.OpenSansBold,
    });
    if (!fontsLoaded) {
        return <AppLoading />;
      }
      const navigationTheme = {
        ...DefaultTheme,
        dark: isDark,
        colors: {
          ...DefaultTheme.colors,
          border: 'rgba(0,0,0,0)',
          text: String(theme.colors.text),
          card: String(theme.colors.card),
          primary: String(theme.colors.primary),
          notification: String(theme.colors.primary),
          background: String(theme.colors.background),
        },
      };
    return (
        <TranslationProvider>
        <ThemeProvider theme={theme} setTheme={setTheme}>
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator>
                {userInfo.access_token ? (
                    <>
                    <Stack.Screen options={{
                        }} name="MainMenu" component={MainMenu}
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
        </ThemeProvider>
        </TranslationProvider>
    );
};

export default Navigation;