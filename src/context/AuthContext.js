import axios from "axios";
import React, {createContext, useState} from "react";
import { BASE_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const createButtonAlert = (e) =>
    Alert.alert('Alert', `${e}`, [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

    const register = (name, email, password) => {
        setIsLoading(true);
        axios
        .post(`${BASE_URL}/api/users?user[email]=${email}&user[username]=${name}&user[password]=${password}`)
        .then (res => {
            let userInfo = res.data;
            setUserInfo(userInfo);
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            setIsLoading(false);
            console.log(userInfo);
        })
        .catch((error) => {
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                createButtonAlert(error.response.data.message)
                // console.log(error.response.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                createButtonAlert("Network Error")
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                createButtonAlert("An error has occurred :(")
                console.log('Error', error.message);
            }
            setIsLoading(false)
            console.log(error.config);
        })
    };

    const login = (email, password) => {
        setIsLoading(true);
        axios.post(`${BASE_URL}/api/users/sign_in?user[email]=${email}&user[password]=${password}`)
        .then(res => {
            let userInfo = res.data
            setUserInfo(userInfo);
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            setIsLoading(false);
            console.log(userInfo);
        }).catch((error) => {
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                createButtonAlert("Invalid Email or Password")
                // console.log(error.response.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                createButtonAlert("Network Error")
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                createButtonAlert("An error has occurred :(")
                console.log('Error', error.message);
            }
            setIsLoading(false)
            console.log(error.config);
        })
    }

    const logout = () => {
        setIsLoading(true);
        // axios.delete(`${BASE_URL}/api/users/sign_out`, {}, {
        //     headers: {HTTP_AUTHORIZATION: `Bearer ${userInfo.access_token}`}
        //     }
        // ).then(res => {
        //     console.log(res.data)
            AsyncStorage.removeItem('userInfo');
            setUserInfo({})
            setIsLoading(false)
        // }).catch(e=> {
        //     console.log(`logout error ${e}`);
        //     setIsLoading(false);
        // });
    }

    return (
        <AuthContext.Provider
         value={{
            isLoading,
            userInfo,
            register,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};