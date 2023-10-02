import React, {useContext, useState, useEffect} from "react"; 
import {Button, StyleSheet, Text, View, FlatList,SafeAreaView, ImageBackground, Image } from "react-native";
import { Input } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import { set } from "react-native-reanimated";

const TeamCreateScreen = () => {
    const {friends, getFriends} = useContext(AuthContext);
    const [combinedChars, setCombinedChars] = useState([]);
    const {assets, colors, gradients, sizes} = useTheme();
    useEffect(() => {
        if (!friends){
            getFriends();
        }
        if (friends){

            console.log(friends)
            setCombinedChars([]);
            let tempArray = [];
            for (let i = 0; i < friends.length; i++) {
                let chars = friends[i].characters;
                for (let j = 0; j < chars.length; j++) {
                    tempArray.push(chars[j])
                }
            }
            setCombinedChars(tempArray);
        }
    }, [friends]);

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <ImageBackground src={`${BASE_URL}${item.class_icon}`}  style={{height: 60,width: 60,justifyContent:'center'}}/>
            <View style={styles.iconContainer}>
                <Image
                src={`${BASE_URL}${item.primary_spec_icon}`}
                style={styles.characterIcon} />
                <Image
                src={`${BASE_URL}${item.secondary_spec_icon}`}
                style={styles.characterIcon} />
            </View>
            <View style={styles.textContainer}>
                <Text h5 style={styles.txt_name}>{item.name}</Text>
            </View>
          </View>
        );
      }


    return (
        <SafeAreaView style={styles.container}>
            {/* <Input
            value={name}
            autoCapitalize="none"
            marginBottom={sizes.m}
            label="Create Team"
            keyboardType="default"
            placeholder="Team Name"
            onChangeText={text => setName(text)}
            />
            <Button
                    title="Add"
                    onPress={() => {createTeam(name)}}
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.primary}>
                    <Text bold white transform="uppercase">
                    Add
                    </Text>
            </Button> */}
            <FlatList
                
                data={combinedChars}
                renderItem={({ item }) => <Item item={item}/>}
                keyExtractor={item => item.id}
                extraData={combinedChars}
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

export default TeamCreateScreen;