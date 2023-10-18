import React, {useContext, useState, useEffect} from "react"; 
import {Button, StyleSheet, Text, View, FlatList,SafeAreaView } from "react-native";
import { Input } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import alertBox from "../components/AlertBox.js"


const FriendsListScreen = () => {

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <Text>{item.username}</Text>
            <Button
                style={styles.removeButton}
                title="Remove"
                onPress={() => {removeFriend(item.id)}}
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
    const {friends, setFriends, getFriends} = useContext(AuthContext);
    const [name, setName] = useState(null);
    const {assets, colors, gradients, sizes} = useTheme();

    useEffect(() => {
        if(!friends){
          getFriends();
        }
    }, [friends]);

    const addFriend = (name) => {
        if(name){
            if (name.includes("#")){
                name = name.replace("#", "-HASHTAG-");
            }
            axios({
                url:`${BASE_URL}/api/friendlist?friend[battletag]=${name}`,
                method : "POST",
            }).then((res)=>{
                setName(null);
                setFriends(res.data)

            }).catch((error) => {
                ErrorHandler(error)
            })
        }
    }

    const removeFriend = (id) => {
        axios({
            url:`${BASE_URL}/api/friendlist/${id}`,
            method : "DELETE",
        }).then((res)=>{
            console.log("Removing friend...")
            setFriends(res.data);
        }
        ).catch((error) => {
            ErrorHandler(error)
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Input
            value={name}
            autoCapitalize="none"
            marginBottom={sizes.m}
            label="Add Friend"
            keyboardType="default"
            placeholder="Username or Battletag"
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
                extraData={friends}
            />
        </SafeAreaView>
    );

};
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
        borderRadius:5
      },
      removeButton:{
        flex:1,
        alignSelf:"right",
      }
});

export default FriendsListScreen;