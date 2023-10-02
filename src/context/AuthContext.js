import axios from "axios";
import React, {createContext, useState} from "react";
import { BASE_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import alertBox from "../components/AlertBox.js"
import ErrorHandler from "../components/ErrorHandler.js"

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [characterList,setCharacterList] = useState([]);//list of characters
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [classes, setClasses] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [races, setRaces] = useState([]);
    const [genders, setGenders] = useState([]);
    const [raids, setRaids] = useState([]);
    const [bosses, setBosses] = useState([]);
    const [friends, setFriends] = useState(null);
    const [teams, setTeams] = useState(null);

    const register = (email, password) => {
        setIsLoading(true);
        axios
        .post(`${BASE_URL}/api/users?user[email]=${email}&user[password]=${password}`)
        .then (res => {
            let userInfo = res.data;
            setUserInfo(userInfo);
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            setIsLoading(false);
            axios.defaults.headers.common = {'Authorization': `Bearer ${userInfo.access_token}`};
        })
        .catch((error) => {
            ErrorHandler(error)
            setIsLoading(false)
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
            ErrorHandler(error)
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
            ErrorHandler(error)
            setIsLoading(false)
        // console.log(error.config);
        })
    };


    const getData= () => {
        axios({
            url:`${BASE_URL}/api/datafile`,
            method : "GET",
        }).then((res)=>{
            console.log(res.data["classes"])
            setClasses(res.data["classes"])
            setSpecs(res.data["specs"])
            setRaces(res.data["races"])
            setGenders(res.data["genders"])
            setRaids(res.data["raids"])
            setBosses(res.data["bosses"])
        }).catch((error) => {
            // Error
            ErrorHandler(error)
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

    const getFriends = async () => {
        setIsLoading(true);
        axios({
            url:`${BASE_URL}/api/friendlist/`,
            method : "GET",
        }).then((res)=>{
            setFriends(res.data);
            setIsLoading(false);
        }).catch((error) => {
            ErrorHandler(error);
            setIsLoading(false);
        })
      };

    const getTeams = async () => {
        setIsLoading(true);
        axios({
            url:`${BASE_URL}/api/teams/`,
            method : "GET",
        }).then((res)=>{
            console.log(res.data);
            setTeams(res.data);
            setIsLoading(false);
        }).catch((error) => {
            ErrorHandler(error);
            setIsLoading(false);
        })
      };

    return (
        <AuthContext.Provider
         value={{
            isLoading,
            setIsLoading,
            userInfo,
            setUserInfo,
            register,
            updateUser,
            logout,
            uploadAvatar,
            getData,
            classes,
            specs,
            races,
            genders,
            raids,
            bosses,
            characterList,
            setCharacterList,
            friends,
            setFriends,
            getFriends,
            teams,
            setTeams,
            getTeams,
        }}>
            {children}
        </AuthContext.Provider>
    );
};