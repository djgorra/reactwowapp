import axios from "axios";
import React, {createContext, useState} from "react";
import { BASE_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false)

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
        .catch(e => {
            console.log(`register error ${e}`);
            if(e.response){
                console.log(e.response.data)
            }
            setIsLoading(false);
        });
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
        }).catch(e => {
            console.log(e)
            if(e.response){
                console.log(`login error ${e.response.data}`)
            }
            setIsLoading(false);
        });
    }

    const logout = () => {
        setIsLoading(true);
        axios.post(`${BASE_URL}/api/users/sign_out`, {}, {
            headers: {Authorization: `Bearer ${userInfo.access_token}`}
            }
        ).then(res => {
            console.log(res.data)
            AsyncStorage.removeItem('userInfo');
            setUserInfo({})
            setIsLoading(false)
        }).catch(e=> {
            console.log(`logout error ${e}`);
            setIsLoading(false);
        });
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