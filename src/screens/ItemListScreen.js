import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ScrollView } from "react-native";
import BlueButton from "../components/BlueButton";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import Accordion from "../components/Accordion";

const ItemListScreen = ({route, navigation}) => {
    const {bosses, characterList, setUserInfo} = useContext(AuthContext);
    const character = characterList.filter((c)=>{ return c["id"]==route.params.characterId; } )[0];
    const raidId = route.params.raidId;
    const [items, setItems] = useState({});
    const [checkedItems, setCheckedItems] = useState(character["wishlist_items"].map((j)=>{ return j["id"]; } ));
    const getData = async () => {
      axios({
          url:`${BASE_URL}/api/raids/${raidId}/items.json`,
          method : "GET",
      }).then((res)=>{
          setItems(res.data);
      }).catch((error) => {
          ErrorHandler(error)
      })
    }

    useEffect(() => {
      getData();
    }, [characterList]);

    function getDatafromChild(item_id, checked){
      if(checked){
        if (checkedItems.indexOf(item_id) < 0){
          checkedItems.push(item_id);
        }
      } else {
        // TODO: Remove item_id from checkedItems
        var arrayindex = checkedItems.indexOf(item_id);
        if(arrayindex >= 0){
          checkedItems.splice(arrayindex, 1);
        }
      }
    }

    function addItems(){
        axios({
            url:`${BASE_URL}/api/characters/${route.params.characterId}/items.json`,
            method : "POST",
            data: {
                "item_ids": checkedItems,
                "raid_id": route.params.raidId,
            }
        }).then((res)=>{
            setUserInfo(res.data);
            navigation.navigate('Characters');
        }).catch((error) => {
            ErrorHandler(error)
        })
    }
    
    return (
        <View style={{flex:1}}>
            <ScrollView style={styles.listContainer} nestedScrollEnabled={true}>
            {Object.keys(items).map((key,index)=>{
                const boss = bosses.filter((b)=>{ return b["id"]==key; } )[0];
                return(
                    <View>
                    {(boss != null) ? <Accordion style={styles.listItem} character={character} sendData={getDatafromChild} title={boss["name"]} data ={items[key]}></Accordion> : <Accordion character={character} sendData={getDatafromChild} title={"Common Drops"} data = {items[key]}></Accordion> }
                </View>
            )
            })}
            </ScrollView>
            <View style={styles.footer}>
                <BlueButton text="Add Items" onPress={()=>addItems()}/>
            </View>
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
      padding:10,
      backgroundColor:"#02000b",
      width:"80%",
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5
    },    
    listContainer:{
        backgroundColor:"#02000b",
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
export default ItemListScreen;