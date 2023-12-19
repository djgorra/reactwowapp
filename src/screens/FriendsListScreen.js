import React, {useContext, useState, useEffect} from "react"; 
import { StyleSheet, View, FlatList,SafeAreaView, Image, TouchableOpacity, Alert } from "react-native";
import {Button, Text, Block} from '../components/';
import BlueButton from '../components/BlueButton';
import { Input } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import alertBox from "../components/AlertBox.js"
import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';


const FriendsListScreen = () => {

    
    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <View style={{flex:1, flexDirection:'row'}}>
                <SvgXml xml={createAvatar(shapes, {seed: `${item.username}`}).toString()} width='75' height='75' style={{ flex:1, marginTop:5}} />
                <View style={{flex:1, flexDirection:'column'}}>    
                    <Text h4 white bold style={{textAlign:"center"}}>{item.username}</Text>
                    <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => {Alert.alert('Please Confirm', `Are you sure you wish to remove ${item.username} from your friend list?`, [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel'
                                },
                                {
                                    text: 'Confirm',
                                    onPress: () => {removeFriend(item.id)},
                                    style: 'destructive'
                                }
                            ])
                        }}>
                        <Text gray style={{textAlign:'center'}}>Remove</Text>
                </TouchableOpacity>
                </View>
            </View>
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
            <Block style={styles.inputContainer}>
                <Image style={styles.redDot} source={require('../assets/images/icecrown/red_dot.png')} />
                <Input
                value={name}
                autoCapitalize="none"
                keyboardType="default"
                placeholder="Username or Battletag"
                onChangeText={text => setName(text)}
                textAlign="center"
                />
            </Block>
            <BlueButton
                text="Add a Friend"
                onPress={() => {addFriend(name)}}>
            </BlueButton>
            <View style={styles.dividerContainer}>
                <Image source={require('../assets/images/icecrown/divider.png')} style={styles.divider} />
            </View>
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
        backgroundColor: '#02000b',
      },
      listItem:{
        margin:10,
        padding:10,
        width:"80%",
        flex:1,
        alignSelf:"center",
        flexDirection:"column",
        borderRadius:5,
      },
      removeButton:{
        margin: 0,
        padding:10,
        textAlign:"center",
      },
      redDot: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        position: 'absolute',
        left:10,
        top:14,
      },
      inputContainer: {
       marginTop: 20,
       marginBottom: -300,
      },
      dividerContainer: {
        height: 50,
        marginTop: 20,
      },
      divider: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        alignSelf: 'center',
      }
});

export default FriendsListScreen;