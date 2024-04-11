import React, {useContext, useEffect, useState} from "react"; 
import {StyleSheet, View, ScrollView, Image } from "react-native";
import BlueButton from "../components/BlueButton";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { FlatList } from "react-native-gesture-handler";
import { Text } from "../components";

const CharacterDropsScreen = ({route, navigation}) => {
    const {characterList, setUserInfo} = useContext(AuthContext);
    const character = characterList.filter((c)=>{ return c["id"]==route.params.characterId; } )[0];
    const [drops, setDrops] = useState({});

    const getData = async () => {
      axios({
          url:`${BASE_URL}/api/characters/${route.params.characterId}/drops`,
          method : "GET",
      }).then((res)=>{
          setDrops(res.data);
          console.log(res.data)
      }).catch((error) => {
          ErrorHandler(error)
      })
    }

    useEffect(() => {
      getData();
    }, []);

    function Item({ item }) {
        return (
            <View style={styles.listItem}>
                <View style={styles.itemContainer}>
                    <Image style={styles.itemImage} source={{uri: `${BASE_URL}${item["item"]["image_path"]}`}} />
                    {item["disenchanted"] == true ? <Image style={styles.disenchanted} source={{uri: `${BASE_URL}/spells/inv_enchant_disenchant.jpg`}}/> : null}
                    <View style={styles.textContainer}>
                        <Text white bold style={{flex:6}}>{item["item"]["name"]}</Text>
                        <Text white bold style={{flex:6}}>{item["created_at_formatted"]}</Text>
                    </View>
                </View>
            </View>
        );
    }

    
    return (
        <View style={{flex:1}}>
            <ScrollView style={styles.listContainer} nestedScrollEnabled={true}>
                {drops.length == 0 ? <Text white bold style={{textAlign: 'center', marginTop: 20}}>This character hasn't received any drops yet!</Text> : null}
                <FlatList
                    data={drops}
                    renderItem={({item}) => (
                        <Item item={item}/>
                    )}
                    keyExtractor={item => item.id}/>

            </ScrollView>
        </View>
    );
}

const borderColor = '#34455e';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#02000b',
      marginTop:60
    },
    listItem:{
      margin:10,
      backgroundColor:"#02000b",
      width:"80%",
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5
    },    
    listContainer:{
        backgroundColor:"#02000b",
    },
    itemImage: {
        width: 50,
        height: 50,
        margin: 10,
    },
    disenchanted: {
        width: 25,
        height: 25,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: borderColor,
        borderWidth: 1,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        justifyContent: 'center',
        paddingTop: 10,
        alignItems: 'center',
        backgroundColor: '#02000b',
        height:75,
        zIndex: 100,
    },
  });
export default CharacterDropsScreen;