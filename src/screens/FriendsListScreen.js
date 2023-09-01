import React, {useContext, useState, useEffect, componentDidMount} from "react"; 
import {Button, StyleSheet, Text, View, FlatList } from "react-native";
import { Input } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import {useData, useTheme, useTranslation} from '../hooks/';
import { set } from "react-native-reanimated";


const FriendsListScreen = () => {

    function Item({ item }) {
        {console.log(item)}
        return (
          <View style={styles.listItem}>
            <Text>{item.username}</Text>
            <Button
                style={styles.removeButton}
                title="Remove"
                onPress={() => {removeFriend(item.username)}}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}>
                <Text bold white transform="uppercase">
                    Remove
                </Text>
            </Button>
          </View>
        );
      }
    const {userInfo, isLoading, logout, updateUser} = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [name, setName] = useState(null);
    const {assets, colors, gradients, sizes} = useTheme();
    const getFriends = async () => {
        console.log("getFriends")
        axios({
            url:`${BASE_URL}/api/friendlist/`,
            method : "GET",
        }).then((res)=>{
            console.log(res.data)
            setFriends(res.data);
        }).catch((error) => {
            ErrorHandler(error)
        })
      };

    useEffect(() => {
        getFriends();
    }, []);

    const addFriend = (name) => {
        axios({
            url:`${BASE_URL}/api/friendlist?friend[battletag]=${name}`,
            method : "POST",
        }).then((res)=>{
            console.log(res.data)
            setFriends(res.data);
        }).catch((error) => {
            ErrorHandler(error)
        })
    }

    const removeFriend = (name) => {
        axios({
            url:`${BASE_URL}/api/friendlist/${name}`,
            method : "DELETE",
        }).then((res)=>{
            console.log(res.data)
            setFriends(res.data);
        }
        ).catch((error) => {
            ErrorHandler(error)
        })
    }

    return (
        <View style={styles.container}>
            <Input
            autoCapitalize="none"
            marginBottom={sizes.m}
            label="Add Friend"
            keyboardType="default"
            placeholder="Add Friend"
            onChangeText={text => setName(text)}
            />
            <Button
                    title="Add"
                    onPress={() => {addFriend(name)}}
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.primary}>
                    <Text bold white transform="uppercase">
                    Add
                    </Text>
            </Button>
            <FlatList
                style={{flex:1}}
                data={friends}
                renderItem={({ item }) => <Item item={item}/>}
                keyExtractor={item => item.id}
            />
        </View>
    );

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        marginTop:60
      },
      listItem:{
        margin:10,
        padding:10,
        backgroundColor:"#FFF",
        width:"80%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5
      },
      removeButton:{
        flex:1,
        alignSelf:"right",
      }
});

export default FriendsListScreen;