import axios from "axios";
import React, {createContext, useState} from "react";
import { BASE_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import alertBox from "../components/AlertBox.js"

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
            axios.defaults.headers.common = {'Authorization': `Bearer ${userInfo.access_token}`};
            console.log(userInfo);
        })
        .catch((error) => {
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                alertBox(error.response.data.message)
                // console.log(error.response.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                alertBox("Network Error")
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                alertBox("An error has occurred :(")
                console.log('Error', error.message);
            }
            setIsLoading(false)
            console.log(error.config);
        })
    };

    

    const updateUser = (name) => {
        
        const bodyParameters = {
           key: "value"
        };
        setIsLoading(true);
        //console.log("token: "+userInfo.access_token);
        axios
        .put(`${BASE_URL}/users?user[username]=${name}`)
        .then (res => {
            let userInfo = res.data;
            setUserInfo(userInfo);
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            setIsLoading(false);
            console.log("Success!");
        })
        .catch((error) => {
            console.log(error)
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                alertBox(error.response.data.message)
                // console.log(error.response.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                alertBox("Network Error")
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                alertBox("An error has occurred :(")
                console.log('Error', error.message);
            }
            setIsLoading(false)
           // console.log(error.config);
        })
    };


    const uploadAvatar = (file, filename, type) => {
        //file = file.replace(":///","://")
        setIsLoading(true);
        //console.log("token: "+userInfo.access_token);
        let formData = new FormData();
        formData.append('user[avatar]', { uri: file, name: filename, type });
        axios
        .patch(`${BASE_URL}/users`, formData, {

            headers: { 'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${userInfo.access_token}`,
            }
        })
        .then (res => {
            setIsLoading(false);
            setUserInfo(userInfo);
            console.log("Success!");
        })
        .catch((error) => {
            console.log(error)
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                alertBox(error.response.data.message)
                // console.log(error.response.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                alertBox("Network Error")
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                alertBox("An error has occurred :(")
                console.log('Error', error.message);
            }
            setIsLoading(false)
        // console.log(error.config);
        })
    };

    const getUser = () => {
        //file = file.replace(":///","://")
        setIsLoading(true);
        //console.log("token: "+userInfo.access_token);
        axios
        .get(`${BASE_URL}/users`)
        .then (res => {
            setIsLoading(false);
            setUserInfo(userInfo);
            console.log("Success!");
        })
        .catch((error) => {
            console.log(error)
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                alertBox(error.response.data.message)
                // console.log(error.response.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                alertBox("Network Error")
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                alertBox("An error has occurred :(")
                console.log('Error', error.message);
            }
            setIsLoading(false)
        // console.log(error.config);
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
            axios.defaults.headers.common = {'Authorization': `Bearer ${userInfo.access_token}`};
        }).catch((error) => {
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                alertBox("Invalid Email or Password")
                // console.log(error.response.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                alertBox("Network Error")
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                alertBox("An error has occurred :(")
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
            delete axios.defaults.headers.common["Authorization"];
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
            updateUser,
            logout,
            uploadAvatar,
            getUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};