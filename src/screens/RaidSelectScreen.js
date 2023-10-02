import React, {useContext, useState, useEffect} from "react"; 
import {Button, StyleSheet, Text, View, FlatList,SafeAreaView, ImageBackground, Image } from "react-native";
import { Input } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import { set } from "react-native-reanimated";

const RaidSelectScreen = () => {
    const {friends, getFriends} = useContext(AuthContext);
    const {assets, colors, gradients, sizes} = useTheme();
    const [raidList, setRaidList] = useState([]);
    useEffect(() => {
        if (!raidList){
            getRaidList();
        }, []);

    getRaidList = () => {
        axios({
            url:`${BASE_URL}/api/raids/`,
            method : "POST",
        }).then((res)=>{
            setName(null);
            setTeams(res.data)
        }).catch((error) => {
            ErrorHandler(error)
        })
    }



    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
        );
      }


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                
                data={raidList}
                renderItem={({ item }) => <Item item={item}/>}
                keyExtractor={item => item.id}
                extraData={raidList}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F7F7F7',
        marginTop:60,
        marginLeft: 20,
        marginRight:20
      },
      listItem:{
        margin:10,
        padding:10,
        backgroundColor:"#FFF",
        width:"80%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5,
      },
      item_character : {
        padding :15,
        borderBottomWidth: 3,
        borderBottomColor : "darkgray",
    },
    characterIcon : {
        width: 30, 
        height: 30,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 30,
        alignSelf:"center",

    },
    iconContainer : {
        marginLeft : 3,
    },
    textContainer : {
        width: '60%',
        alignContent : "flex-end",
    },
    txt_name : {
      width: "auto",
      alignSelf: "center",
    },
});

export default RaidSelectScreen;